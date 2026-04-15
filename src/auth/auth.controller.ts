import {
  Controller,
  Get,
  Inject,
  Logger,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ClientProxy } from '@nestjs/microservices';
import { USERS_SERVICE, EVENTS_SERVICE } from '../config/services.js';
import { envs } from '../config/index.js';
import { PublisherService } from '../common/publisher.service.js';
import { GoogleCallbackGuard } from './guards/google-callback.guard.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { GetUser } from './decorators/get-user.decorator.js';
import type { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { LoginDto } from './dto/login.dto.js';
import { Throttle } from '@nestjs/throttler';
import { TwoFactorCodeDto } from './dto/two-factor-code.dto.js';
import { TwoFactorVerifyLoginDto } from './dto/two-factor-verify-login.dto.js';
import { TwoFactorService } from './services/two-factor.service.js';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    @Inject(USERS_SERVICE) private readonly authClient: ClientProxy,
    @Inject(EVENTS_SERVICE) private readonly eventsClient: ClientProxy,
    private readonly publisher: PublisherService,
    private readonly twoFactorService: TwoFactorService,
  ) {}

  private buildAuthEventPayload(result: { token: string; user: any }) {
    return {
      userId: result.user.id ?? result.user.userId,
      token: result.token,
      email: result.user.email,
      name: result.user.name,
      role: result.user.role,
      googleId: result.user.googleId,
      picture: result.user.picture,
    };
  }

  private async establishPassportSession(req: Request, user: any): Promise<void> {
    await new Promise<void>((resolve) => {
      req.logIn(user, (err) => {
        if (err) {
          this.publisher['logger']?.warn?.('req.logIn failed: ' + String(err));
        }
        resolve();
      });
    });
  }

  private publishTokenGenerated(payload: {
    userId: string;
    token: string;
    email: string;
    name: string;
    role: string;
    googleId?: string;
    picture?: string;
  }): void {
    this.logger.log('[Auth] Emitiendo auth.tokenGenerated', {
      userId: payload.userId,
      email: payload.email,
    });

    this.publisher.publish('auth.tokenGenerated', payload);
  }

  private extractErrorStatusCode(error: unknown): number | undefined {
    const candidate = error as
      | {
          statusCode?: number;
          error?: { statusCode?: number };
          response?: { statusCode?: number };
        }
      | undefined;

    if (typeof candidate?.statusCode === 'number') {
      return candidate.statusCode;
    }

    if (typeof candidate?.error?.statusCode === 'number') {
      return candidate.error.statusCode;
    }

    if (typeof candidate?.response?.statusCode === 'number') {
      return candidate.response.statusCode;
    }

    return undefined;
  }

  private extractErrorMessage(error: unknown): string {
    if (typeof error === 'string') {
      return error;
    }

    const candidate = error as
      | {
          message?: string;
          error?: { message?: string };
          response?: { message?: string };
        }
      | undefined;

    if (typeof candidate?.message === 'string') {
      return candidate.message;
    }

    if (typeof candidate?.error?.message === 'string') {
      return candidate.error.message;
    }

    if (typeof candidate?.response?.message === 'string') {
      return candidate.response.message;
    }

    return String(error);
  }

  private isNotFoundError(error: unknown): boolean {
    const statusCode = this.extractErrorStatusCode(error);
    if (statusCode === 404) {
      return true;
    }

    const message = this.extractErrorMessage(error).toLowerCase();
    return message.includes('not found');
  }

  private isConflictError(error: unknown): boolean {
    const statusCode = this.extractErrorStatusCode(error);
    if (statusCode === 409) {
      return true;
    }

    const message = this.extractErrorMessage(error).toLowerCase();
    return (
      message.includes('already exists') ||
      message.includes('duplicate') ||
      message.includes('conflict')
    );
  }

  private redirectGoogleAuthError(res: Response, errorCode: string) {
    const redirectUrl = `${envs.frontendUrl}/?error=${encodeURIComponent(errorCode)}&auth=google`;
    return res.redirect(redirectUrl);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(GoogleCallbackGuard)
  async googleAuthRedirect(
    @Req() req: Request & { user?: any },
    @Res() res: Response,
  ) {
    if (!req.user?.email) {
      this.logger.error('[Google Auth] Missing user/email in callback payload');
      return this.redirectGoogleAuthError(res, 'google_auth_failed');
    }

    const { firstName, lastName, googleId } = req.user;
    const email = String(req.user.email).trim().toLowerCase();
    let user: any = null;

    try {
      // Buscar si el usuario ya existe por email
      const existingUser = await firstValueFrom(
        this.authClient.send('findUserByEmail', { email }),
      );

      if (existingUser) {
        user = existingUser;
      }
    } catch (error) {
      if (this.isNotFoundError(error)) {
        this.logger.warn(
          `[Google Auth] User not found by email, proceeding to create: ${email}`,
        );
      } else {
        this.logger.error(
          `[Google Auth] findUserByEmail failed for ${email}: ${this.extractErrorMessage(error)}`,
        );
        return this.redirectGoogleAuthError(res, 'oauth_user_lookup');
      }
    }

    if (!user) {
      try {
        user = await firstValueFrom(
          this.authClient.send('createUserGoogle', {
            name: `${firstName} ${lastName}`,
            email,
            googleId,
            password: '',
            role: 'USER',
          }),
        );
      } catch (error) {
        if (!this.isConflictError(error)) {
          this.logger.error(
            `[Google Auth] createUserGoogle failed for ${email}: ${this.extractErrorMessage(error)}`,
          );
          return this.redirectGoogleAuthError(res, 'oauth_user_create');
        }

        this.logger.warn(
          `[Google Auth] createUserGoogle conflict for ${email}, retrying findUserByEmail`,
        );

        try {
          user = await firstValueFrom(
            this.authClient.send('findUserByEmail', { email }),
          );
        } catch (retryError) {
          this.logger.error(
            `[Google Auth] retry findUserByEmail failed for ${email}: ${this.extractErrorMessage(retryError)}`,
          );
          return this.redirectGoogleAuthError(res, 'oauth_user_lookup');
        }
      }
    }

    if (!user) {
      this.logger.error(`[Google Auth] User is null after lookup/create for ${email}`);
      return this.redirectGoogleAuthError(res, 'oauth_user_missing');
    }

    let token: string;
    try {
      token = await firstValueFrom(this.authClient.send('generateToken', user));
    } catch (error) {
      this.logger.error(
        `[Google Auth] generateToken failed for ${email}: ${this.extractErrorMessage(error)}`,
      );
      return this.redirectGoogleAuthError(res, 'oauth_token');
    }

    const userId = String(user.id ?? user.userId ?? '');
    if (!userId) {
      this.logger.error(`[Google Auth] Missing userId for ${email}`);
      return this.redirectGoogleAuthError(res, 'oauth_user_missing_id');
    }

    const isTwoFactorEnabled = await this.twoFactorService.isEnabled(userId);
    if (isTwoFactorEnabled) {
      const tempToken = await this.twoFactorService.createPendingLogin(user, token);
      return res.redirect(
        `${envs.frontendUrl}/?requires2fa=true&tempToken=${encodeURIComponent(tempToken)}&auth=google`,
      );
    }

    const eventPayload = {
      userId,
      token,
      email: user.email,
      name: user.name,
      role: user.role,
      googleId: user.googleId,
      picture: user.picture,
    };

    this.logger.log('[Google Auth] Emitiendo auth.tokenGenerated', {
      userId: eventPayload.userId,
      email: eventPayload.email,
    });

    try {
      this.publisher.publish('auth.tokenGenerated', eventPayload);
    } catch (error) {
      this.logger.warn(
        `[Google Auth] publish auth.tokenGenerated failed: ${error?.message || error}`,
      );
    }

    return res.redirect(`${envs.frontendUrl}/?token=${encodeURIComponent(token)}`);
  }

  @Get('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    console.log('[Logout] Iniciando logout...');

    // Si no hay usuario en sesión, responder inmediatamente
    if (!req.user && !req.session) {
      console.log('[Logout] No hay sesión activa');
      return res.json({ message: 'No hay sesión activa' });
    }

    req.logout((err) => {
      if (err) {
        console.error('[Logout] Error en req.logout:', err);
        return res
          .status(500)
          .json({ message: 'Error al cerrar sesión', error: err });
      }

      console.log('[Logout] req.logout() completado');

      if (req.session) {
        console.log('[Logout] Destruyendo sesión...');
        req.session.destroy((sessionErr) => {
          if (sessionErr) {
            console.error('[Logout] Error al destruir sesión:', sessionErr);
            return res
              .status(500)
              .json({ message: 'Error al destruir sesión', error: sessionErr });
          }
          console.log('[Logout] Sesión destruida exitosamente');
          res.clearCookie('connect.sid');
          return res.json({ message: 'Sesión cerrada exitosamente' });
        });
      } else {
        console.log('[Logout] No hay sesión para destruir');
        res.clearCookie('connect.sid');
        return res.json({ message: 'Sesión cerrada exitosamente' });
      }
    });
  }

  @Post('login')
  @Throttle({default: {ttl: 60_000, limit: 5}})
  async login(
    @Body() payload: LoginDto,
    @Req() req: Request,
  ) {
    const result = await firstValueFrom(this.authClient.send('login', payload));

    if (result && result.token && result.user) {
      const userId = String(result.user.id ?? result.user.userId ?? '');

      if (userId && (await this.twoFactorService.isEnabled(userId))) {
        const tempToken = await this.twoFactorService.createPendingLogin(
          result.user,
          result.token,
        );

        return {
          requiresTwoFactor: true,
          tempToken,
          expiresInSeconds: envs.twoFactorTempTokenTtlSeconds,
        };
      }

      const eventPayload = this.buildAuthEventPayload(result);
      this.publishTokenGenerated(eventPayload);
      await this.establishPassportSession(req, result.user);
    }

    return result;
  }

  @Get('2fa/status')
  @UseGuards(JwtAuthGuard)
  async twoFactorStatus(@GetUser() user: any) {
    const userId = String(user?.id ?? user?.userId ?? '');
    return {
      enabled: userId ? await this.twoFactorService.isEnabled(userId) : false,
      issuer: envs.twoFactorIssuer,
    };
  }

  @Post('2fa/setup')
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  async setupTwoFactor(@GetUser() user: any) {
    const userId = String(user?.id ?? user?.userId ?? '');
    const email = String(user?.email ?? '');
    return this.twoFactorService.createSetup(userId, email);
  }

  @Post('2fa/enable')
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  async enableTwoFactor(
    @GetUser() user: any,
    @Body() payload: TwoFactorCodeDto,
  ) {
    const userId = String(user?.id ?? user?.userId ?? '');
    return this.twoFactorService.enableWithCode(userId, payload.code);
  }

  @Post('2fa/disable')
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  async disableTwoFactor(
    @GetUser() user: any,
    @Body() payload: TwoFactorCodeDto,
  ) {
    const userId = String(user?.id ?? user?.userId ?? '');
    return this.twoFactorService.disableWithCode(userId, payload.code);
  }

  @Post('2fa/verify-login')
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  async verifyTwoFactorLogin(
    @Body() payload: TwoFactorVerifyLoginDto,
    @Req() req: Request,
  ) {
    const result = await this.twoFactorService.consumePendingLogin(
      payload.tempToken,
      payload.code,
    );

    if (result && result.token && result.user) {
      const eventPayload = this.buildAuthEventPayload(result);
      this.publishTokenGenerated(eventPayload);
      await this.establishPassportSession(req, result.user);
    }

    return result;
  }
}
