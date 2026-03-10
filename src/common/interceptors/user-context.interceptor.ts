import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class UserContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // Obtener usuario de la sesión (Passport)
    const user = request.user;

    // Si hay usuario autenticado, agregarlo al contexto
    if (user) {
      // Agregar userId al body para que llegue al microservicio
      if (request.body && typeof request.body === 'object') {
        request.body.userId = user.id || user.userId;
      }
    }

    return next.handle();
  }
}
