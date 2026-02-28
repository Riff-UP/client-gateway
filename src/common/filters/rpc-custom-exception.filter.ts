import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const error = exception.getError() as {
      statusCode?: number
      message?: string
      code?: string
    };

    const statusCode = error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message ?? 'Internal server error';
    const code = error.code ?? this.getCodeFromStatus(statusCode)

    response.status(statusCode).json({
      code,
      message,
      details: {}
    });
  }

  private getCodeFromStatus(statusCode: number) : string{
    const codes: Record<number, string> ={
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      500: 'INTERNAL_SERVER_ERROR'
    }
    return codes[statusCode] ?? 'INTERNAL_SERVER_ERROR'
  }
}