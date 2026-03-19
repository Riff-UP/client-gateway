import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { envs } from '../../config/index.js';

@Injectable()
export class GoogleCallbackGuard extends AuthGuard('google') {
  private readonly logger = new Logger(GoogleCallbackGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      return (await super.canActivate(context)) as boolean;
    } catch (error) {
      const response = context.switchToHttp().getResponse<Response>();
      const errorCode = this.getOAuthErrorCode(error);

      this.logger.error(
        `[Google OAuth] Callback guard failed with ${errorCode}: ${this.extractErrorMessage(error)}`,
      );

      response.redirect(
        `${envs.frontendUrl}/?error=${encodeURIComponent(errorCode)}&auth=google`,
      );

      return false;
    }
  }

  handleRequest<TUser = any>(
    err: unknown,
    user: unknown,
    info: unknown,
    _context: ExecutionContext,
    _status?: unknown,
  ): TUser {
    if (err) {
      throw err;
    }

    if (!user) {
      throw new UnauthorizedException(this.extractErrorMessage(info));
    }

    return user as TUser;
  }

  private getOAuthErrorCode(error: unknown): string {
    const message = this.extractErrorMessage(error).toLowerCase();

    if (message.includes('invalid_grant')) {
      return 'google_invalid_grant';
    }

    if (message.includes('invalid_client')) {
      return 'google_invalid_client';
    }

    if (message.includes('redirect_uri_mismatch')) {
      return 'google_redirect_uri_mismatch';
    }

    if (message.includes('access_denied')) {
      return 'google_access_denied';
    }

    return 'google_auth_failed';
  }

  private extractErrorMessage(error: unknown): string {
    if (typeof error === 'string') {
      return error;
    }

    const candidate = error as
      | {
          message?: string;
          error?: string;
          data?: string;
          oauthError?: { message?: string; data?: string };
        }
      | undefined;

    if (typeof candidate?.message === 'string') {
      return candidate.message;
    }

    if (typeof candidate?.error === 'string') {
      return candidate.error;
    }

    if (typeof candidate?.data === 'string') {
      return candidate.data;
    }

    if (typeof candidate?.oauthError?.message === 'string') {
      return candidate.oauthError.message;
    }

    if (typeof candidate?.oauthError?.data === 'string') {
      return candidate.oauthError.data;
    }

    return String(error);
  }
}