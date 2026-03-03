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
  ) { }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) { }

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
        // Emitir evento para que otros microservicios lo consuman (publicar al exchange)
        this.publisher.publish('auth.tokenGenerated', {
          user: existingUser,
          token,
        });
        return res.redirect(`http://localhost:3000/home?token=${token}`);
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

      // Emitir evento para que otros microservicios lo consuman (publicar al exchange)
      this.publisher.publish('auth.tokenGenerated', {
        user: newUser,
        token,
      });

      return res.redirect(`http://localhost:3000/home?token=${token}`);
    }
  }

  @Get('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.logout((err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: 'Error al cerrar sesión', error: err });
      }

      if (req.session) {
        req.session.destroy((sessionErr) => {
          if (sessionErr) {
            return res
              .status(500)
              .json({ message: 'Error al destruir sesión', error: sessionErr });
          }
          res.clearCookie('connect.sid');
          return res.json({ message: 'Sesión cerrada exitosamente' });
        });
      } else {
        return res.json({ message: 'Sesión cerrada exitosamente' });
      }
    });
  }

  @Post('login')
  async login(@Body() payload: { email: string; password: string }) {
    const result = await firstValueFrom(this.authClient.send('login', payload));

    // Emitir evento para que otros microservicios repliquen el usuario
    if (result && result.token && result.user) {
      this.publisher.publish('auth.tokenGenerated', {
        user: result.user,
        token: result.token,
      });
    }

    return result;
  }
}
