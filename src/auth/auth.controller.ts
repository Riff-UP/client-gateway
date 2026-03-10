import {
  Controller,
  Get,
  Inject,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ClientProxy } from '@nestjs/microservices';
import { USERS_SERVICE, EVENTS_SERVICE } from '../config/services.js';
import { PublisherService } from '../common/publisher.service.js';
import type { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(USERS_SERVICE) private readonly authClient: ClientProxy,
    @Inject(EVENTS_SERVICE) private readonly eventsClient: ClientProxy,
    private readonly publisher: PublisherService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const { email, firstName, lastName, googleId } = req.user;

    try {
      // Buscar si el usuario ya existe por email
      const existingUser = await firstValueFrom(
        this.authClient.send('findUserByEmail', { email }),
      );

      if (existingUser) {
        // Si el usuario existe generar token y redirigir
        const token = await firstValueFrom(
          this.authClient.send('generateToken', existingUser),
        );

        const eventPayload = {
          userId: existingUser.id ?? existingUser.userId,
          token,
          email: existingUser.email,
          name: existingUser.name,
          role: existingUser.role,
          googleId: existingUser.googleId,
          picture: existingUser.picture,
        };

        console.log(
          '📤 [Google Auth - Existing User] Emitiendo auth.tokenGenerated:',
          { userId: eventPayload.userId, email: eventPayload.email },
        );

        this.publisher.publish('auth.tokenGenerated', eventPayload);

        // --- CÓDIGO ACTUALIZADO AQUÍ ---
        // Lee la variable de entorno, si no existe usa localhost (ideal para desarrollo local)
        const frontUrl = process.env.FRONT_URL || 'http://localhost:3000';
        return res.redirect(`${frontUrl}/?token=${token}`);
      }
    } catch (error) {
      // Si el usuario no existe crear cuenta nueva
      const newUser = await firstValueFrom(
        this.authClient.send('createUserGoogle', {
          name: `${firstName} ${lastName}`,
          email,
          googleId,
          password: '',
          role: 'USER',
        }),
      );

      const token = await firstValueFrom(
        this.authClient.send('generateToken', newUser),
      );

      const eventPayload = {
        userId: newUser.id ?? newUser.userId,
        token,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        googleId: newUser.googleId,
        picture: newUser.picture,
      };

      console.log(
        '📤 [Google Auth - New User] Emitiendo auth.tokenGenerated:',
        { userId: eventPayload.userId, email: eventPayload.email },
      );

      // Emitir evento para que otros microservicios lo consuman (publicar al exchange)
      this.publisher.publish('auth.tokenGenerated', eventPayload);

      // --- CÓDIGO ACTUALIZADO AQUÍ ---
      const frontUrl = process.env.FRONT_URL || 'http://localhost:3000';
      return res.redirect(`${frontUrl}/?token=${token}`);
    }
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
  async login(
    @Body() payload: { email: string; password: string },
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
