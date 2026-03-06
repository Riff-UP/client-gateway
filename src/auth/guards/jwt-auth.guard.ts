import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

/** Decodifica el payload del JWT sin verificar la firma */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = Buffer.from(base64, 'base64').toString('utf8');
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * Guard que extrae y decodifica el JWT del header Authorization.
 * NO verifica la firma — la verificación real la hace el users-ms.
 * Esto permite que el gateway funcione sin importar el JWT_SECRET del users-ms.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'No autenticado. Envía el header Authorization: Bearer <token>',
      );
    }

    const token = authHeader.slice(7);
    const payload = decodeJwtPayload(token);

    if (!payload) {
      throw new UnauthorizedException('Token JWT inválido o malformado');
    }

    // Inyectar el usuario en req.user para que @GetUser() lo recupere
    (request as any).user = {
      id: (payload['id'] ?? payload['sub'] ?? payload['userId']) as string,
      email: payload['email'] as string,
      role: payload['role'] as string,
    };

    return true;
  }
}

