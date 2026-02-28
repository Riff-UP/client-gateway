import { catchError, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

export const handleRpcCustomError = () =>
  catchError(error => throwError(() => new RpcException(error)));