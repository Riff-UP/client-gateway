import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

/**
 * Guard de rate limiting para endpoints de autenticación.
 * Permite 5 intentos por minuto por IP — protege contra fuerza bruta en login.
 */
@Injectable()
export class AuthThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): Promise<string> {
    // Usar IP real considerando proxies (Railway usa X-Forwarded-For)
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ??
      req.ip ??
      'unknown';
    return Promise.resolve(ip);
  }

  protected async shouldSkip(): Promise<boolean> {
    return false; // Nunca saltar en auth
  }
}