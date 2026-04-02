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
import type { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { LoginDto } from './dto/login.dto.js';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    @Inject(USERS_SERVICE) private readonly authClient: ClientProxy,
    @Inject(EVENTS_SERVICE) private readonly eventsClient: ClientProxy,
    private readonly publisher: PublisherService,
  ) {}

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

  private readState(req: Request): string | undefined {
    const state = (req.query as { state?: unknown } | undefined)?.state;
    return typeof state === 'string' && state.trim() ? state : undefined;
  }

  private resolveFrontendOrigin(): string {
    try {
      return new URL(envs.frontendUrl).origin;
    } catch {
      return '*';
    }
  }

  private buildGoogleOAuthCallbackHtml(
    accessToken: string,
    state?: string,
  ): string {
    const postMessageOrigin = this.serializeForInlineScript(
      this.resolveFrontendOrigin(),
    );
    const fallbackUrl =
      envs.analyticsCallbackUrl?.trim() || envs.frontendUrl;
    const serializedFallbackUrl = this.serializeForInlineScript(fallbackUrl);

    const serializedPayload = this.serializeForInlineScript({
      access_token: accessToken,
      state: state ?? null,
    });

    return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>OAuth completado</title>
  </head>
  <body>
    <script>
      (function () {
        const payload = ${serializedPayload};
        const message = {
          type: 'analytics-oauth-success',
          payload,
        };

        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(message, ${postMessageOrigin});
          window.close();
          return;
        }

        const params = new URLSearchParams();
        params.set('access_token', payload.access_token);
        if (typeof payload.state === 'string' && payload.state.length > 0) {
          params.set('state', payload.state);
        }

        const redirectUrl = new URL(${serializedFallbackUrl});
        redirectUrl.hash = params.toString();
        window.location.replace(redirectUrl.toString());
      })();
    </script>
    OAuth completado correctamente. Puedes cerrar esta ventana.
  </body>
</html>`;
  }

  private serializeForInlineScript(value: unknown): string {
    return JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, (char) => {
      switch (char) {
        case '<':
          return '\\u003c';
        case '>':
          return '\\u003e';
        case '&':
          return '\\u0026';
        case '\u2028':
          return '\\u2028';
        case '\u2029':
          return '\\u2029';
        default:
          return char;
      }
    });
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

    const eventPayload = {
      userId: user.id ?? user.userId,
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

    const state = this.readState(req);

    return res.type('html').send(this.buildGoogleOAuthCallbackHtml(token, state));
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
      const eventPayload = {
        userId: result.user.id ?? result.user.userId,
        token: result.token,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
        googleId: result.user.googleId,
        picture: result.user.picture,
      };

      console.log('[Login] Emitiendo auth.tokenGenerated:', {
        userId: eventPayload.userId,
        email: eventPayload.email,
      });

      this.publisher.publish('auth.tokenGenerated', eventPayload);

      // Guardar usuario en sesión de Passport
      await new Promise<void>((resolve) => {
        req.logIn(result.user, (err) => {
          if (err) {
            this.publisher['logger']?.warn?.(
              'req.logIn failed: ' + String(err),
            );
          }
          resolve();
        });
      });
    }

    return result;
  }
}
