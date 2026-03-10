import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// El gateway solo necesita decodificar el JWT para extraer el userId.
// La verificación de firma real la hace el users-ms.
// Usamos un secret genérico + ignoreExpiration para que nunca rechace el token
// antes de llegar al microservicio.
// NOTA: Si quieres verificación real, iguala JWT_SECRET con el del users-ms.
const SECRET = process.env['JWT_SECRET'] ?? 'riff-2026-secret';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true, // El MS de usuarios ya valida la expiración
      secretOrKey: SECRET,
    });
  }

  validate(payload: Record<string, any>) {
    // El MS de usuarios firma el JWT con: { id, email, role, iat, exp }
    return {
      id: (payload['id'] ?? payload['sub'] ?? payload['userId']) as string,
      email: payload['email'] as string,
      role: payload['role'] as string,
    };
  }
}
