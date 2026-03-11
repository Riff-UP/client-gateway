import { HttpException, HttpStatus } from '@nestjs/common';
import { handleRpcCustomError } from './rpc-custom-error.helper';

describe('handleRpcCustomError', () => {
  it('preserva detail en errores RPC tipados', () => {
    try {
      handleRpcCustomError({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'OAuth callback failed',
        code: 'BAD_REQUEST',
        detail: 'invalid_grant',
      });
      fail('Expected handleRpcCustomError to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      const httpError = error as HttpException;
      expect(httpError.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect(httpError.getResponse()).toEqual({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'OAuth callback failed',
        error: 'BAD_REQUEST',
        detail: 'invalid_grant',
      });
    }
  });

  it('desempaqueta errores RPC anidados dentro de error', () => {
    try {
      handleRpcCustomError({
        error: {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Google token exchange failed',
          code: 'UNAUTHORIZED',
          detail: 'redirect_uri_mismatch',
        },
      });
      fail('Expected handleRpcCustomError to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      const httpError = error as HttpException;
      expect(httpError.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
      expect(httpError.getResponse()).toEqual({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Google token exchange failed',
        error: 'UNAUTHORIZED',
        detail: 'redirect_uri_mismatch',
      });
    }
  });

  it('usa detail anidado como fallback cuando no hay statusCode tipado', () => {
    try {
      handleRpcCustomError({
        error: {
          detail: 'invalid_grant: Bad Request',
        },
      });
      fail('Expected handleRpcCustomError to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      const httpError = error as HttpException;
      expect(httpError.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(httpError.getResponse()).toEqual({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error from Microservice',
        detail: 'invalid_grant: Bad Request',
      });
    }
  });
});
