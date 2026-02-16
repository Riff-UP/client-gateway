import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './strategies/jwt.strategy';

export interface UserData {
  id?: string;
  userId?: string;
  googleId?: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    userId: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(user: UserData): Promise<LoginResponse> {
    const payload: JwtPayload = {
      sub: (user.id || user.userId || user.googleId) as string,
      email: user.email,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user: {
        userId: payload.sub,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      return payload;
    } catch {
      throw new Error('Token inválido o expirado');
    }
  }
}
