import { RpcException } from '@nestjs/microservices';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';

export class RpcCustomExceptionHelper {
  static notFound(resource: string, id?: string) {
    throw new RpcException({
      statusCode: HttpStatus.NOT_FOUND,
      code: 'NOT_FOUND',
      message: id
        ? `${resource} with id ${id} not found`
        : `${resource} not found`,
    });
  }

  static conflict(message: string) {
    throw new RpcException({
      statusCode: HttpStatus.CONFLICT,
      code: 'CONFLICT',
      message,
    });
  }

  static badRequest(message: string) {
    throw new RpcException({
      statusCode: HttpStatus.BAD_REQUEST,
      code: 'BAD_REQUEST',
      message,
    });
  }

  static unauthorized(message: string = 'Unauthorized') {
    throw new RpcException({
      statusCode: HttpStatus.UNAUTHORIZED,
      code: 'UNAUTHORIZED',
      message,
    });
  }

  static internal(message: string = 'Internal server error') {
    throw new RpcException({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL_SERVER_ERROR',
      message,
    });
  }
}
export const handleRpcCustomError = (error: any): never => {
  const logger = new Logger('RpcExceptionHandler');

  if (error && error.statusCode && error.message) {
    throw new HttpException(
      {
        statusCode: error.statusCode,
        message: error.message,
        error: error.code || 'RpcError',
      },
      error.statusCode,
    );
  }

  // Fallback: Si el microservicio explota con un error desconocido (ej. base de datos caída)
  // Log full error for debugging
  logger.error(
    'Unexpected RPC error:',
    JSON.stringify(error, Object.getOwnPropertyNames(error)),
  );
  if (error && (error.message || error.stack)) {
    logger.error(error.message || error.stack);
  }

  // Try to include microservice error message in HTTP response for easier debugging (safe for local/dev)
  const detail = error?.message || error?.error || JSON.stringify(error);
  throw new HttpException(
    {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error from Microservice',
      detail,
    },
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
};
