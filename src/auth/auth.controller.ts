import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Este método inicia el flujo de autenticación con Google
    // El guard redirige automáticamente a Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    // Google redirige aquí después de la autenticación
    return {
      message: 'Usuario autenticado por Google',
      user: req.user,
    };
  }

  @Get('logout')
  logout(@Req() req, @Res() res: Response) {
    // Limpiar la sesión de Passport
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Error al cerrar sesión', error: err });
      }
      
      // Destruir la sesión si existe
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
