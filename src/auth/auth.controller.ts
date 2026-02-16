import { Controller, Get, Post, Body, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';

export class LoginDto {
  email!: string;
  password?: string;
  userId?: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // Este endpoint puede ser usado para login manual
    // Por ahora genera un token basándose en los datos proporcionados
    return this.authService.generateToken({
      id: loginDto.userId,
      email: loginDto.email,
    });
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Este método inicia el flujo de autenticación con Google
    // El guard redirige automáticamente a Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    // Google redirige aquí después de la autenticación
    // Generar JWT token para el usuario autenticado
    const token = await this.authService.generateToken(req.user);
    
    return {
      message: 'Usuario autenticado por Google',
      ...token,
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@GetUser() user: any) {
    return {
      message: 'Perfil del usuario',
      user,
    };
  }

  @Post('verify-token')
  async verifyToken(@Body('token') token: string) {
    try {
      const payload = await this.authService.verifyToken(token);
      return {
        valid: true,
        payload,
      };
    } catch (error: any) {
      return {
        valid: false,
        message: error?.message || 'Token inválido',
      };
    }
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
