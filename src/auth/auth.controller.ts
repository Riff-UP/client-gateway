import { Controller, Get, Inject, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ClientProxy } from '@nestjs/microservices';
import { USERS_SERVICE } from 'src/config/services';
import type { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
export class AuthController {

  constructor(
    @Inject(USERS_SERVICE) private readonly authClient: ClientProxy,
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
        this.authClient.send('findUserByEmail', { email })
      );

      if (existingUser) {
        // Si el usuario existe generar token y redirigir
        const token = await firstValueFrom(
          this.authClient.send('generateToken', existingUser)
        );
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
          role: 'USER'
        })
      );

      const token = await firstValueFrom(
        this.authClient.send('generateToken', newUser)
      );

      return res.redirect(`http://localhost:3000/home?token=${token}`);
    }
  }

  @Get('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Error al cerrar sesión', error: err });
      }

      if (req.session) {
        req.session.destroy((sessionErr) => {
          if (sessionErr) {
            return res.status(500).json({ message: 'Error al destruir sesión', error: sessionErr });
          }
          res.clearCookie('connect.sid');
          return res.json({ message: 'Sesión cerrada exitosamente' });
        });
      } else {
        return res.json({ message: 'Sesión cerrada exitosamente' });
      }
    });
  }
}