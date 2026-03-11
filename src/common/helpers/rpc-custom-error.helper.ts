import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

interface RpcErrorShape {
  statusCode?: number;
  message?: string;
  code?: string;
  detail?: string;
  details?: unknown;
  error?: unknown;
  response?: unknown;
}

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

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isRpcErrorShape = (value: unknown): value is RpcErrorShape =>
  isObject(value);

const extractRpcErrorShape = (error: unknown): RpcErrorShape | undefined => {
  if (!isRpcErrorShape(error)) {
    return undefined;
  }

  if (
    typeof error.statusCode === 'number' &&
    typeof error.message === 'string'
  ) {
    return error;
  }

  const nestedCandidates = [error.error, error.response];

  for (const candidate of nestedCandidates) {
    if (
      isRpcErrorShape(candidate) &&
      typeof candidate.statusCode === 'number' &&
      typeof candidate.message === 'string'
    ) {
      return candidate;
    }
  }

  return error;
};

const extractFallbackDetail = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (!isObject(error)) {
    return JSON.stringify(error);
  }

  const nestedError = error.error;
  if (typeof nestedError === 'string') {
    return nestedError;
  }

  if (isObject(nestedError)) {
    const nestedMessage = nestedError.message;
    const nestedDetail = nestedError.detail;
    const nestedDetails = nestedError.details;

    if (typeof nestedDetail === 'string') {
      return nestedDetail;
    }

    if (typeof nestedMessage === 'string') {
      return nestedMessage;
    }

    if (nestedDetails !== undefined) {
      return JSON.stringify(nestedDetails);
    }
  }

  const response = error.response;
  if (isObject(response)) {
    const responseDetail = response.detail;
    const responseMessage = response.message;
    const responseDetails = response.details;

    if (typeof responseDetail === 'string') {
      return responseDetail;
    }

    if (typeof responseMessage === 'string') {
      return responseMessage;
    }

    if (responseDetails !== undefined) {
      return JSON.stringify(responseDetails);
    }
  }

  if (typeof error.message === 'string') {
    return error.message;
  }

  return JSON.stringify(error);
};

export const handleRpcCustomError = (error: unknown): never => {
  const logger = new Logger('RpcExceptionHandler');
  const rpcError = extractRpcErrorShape(error);

  if (
    rpcError &&
    typeof rpcError.statusCode === 'number' &&
    typeof rpcError.message === 'string'
  ) {
    throw new HttpException(
      {
        statusCode: rpcError.statusCode,
        message: rpcError.message,
        error: typeof rpcError.code === 'string' ? rpcError.code : 'RpcError',
        ...(typeof rpcError.detail === 'string'
          ? { detail: rpcError.detail }
          : {}),
        ...(rpcError.details !== undefined
          ? { details: rpcError.details }
          : {}),
      },
      rpcError.statusCode,
    );
  }

  logger.error(
    'Unexpected RPC error:',
    JSON.stringify(
      error,
      error instanceof Error ? Object.getOwnPropertyNames(error) : undefined,
    ),
  );

  if (error instanceof Error) {
    logger.error(error.stack || error.message);
  }

  throw new HttpException(
    {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error from Microservice',
      detail: extractFallbackDetail(error),
    },
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
};
