import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import type { Response } from 'express';
import { catchError, firstValueFrom } from 'rxjs';
import { handleRpcCustomError } from '../../../common';
import { envs } from '../../../config';
import { CONTENT_SERVICE } from '../../../config/services';
import {
  AnalyticsAuthCallbackQueryDto,
  AnalyticsAuthGoogleQueryDto,
  AnalyticsConfigUpsertDto,
  AnalyticsExportDto,
  AnalyticsMetricsQueryDto,
  AnalyticsSnapshotDto,
  AnalyticsSnapshotsQueryDto,
  AnalyticsWorkloadDto,
} from '../../dto';

type AnalyticsGoogleAuthUrlResponse =
  | string
  | {
      url?: string;
      data?: {
        url?: string;
      };
    };

type AnalyticsRedirectResponse = Pick<Response, 'redirect'>;
type AnalyticsHtmlResponse = Pick<Response, 'type' | 'send' | 'setHeader'>;

@Controller('analytics')
export class AnalyticsController {
  private readonly logger = new Logger(AnalyticsController.name);

  constructor(
    @Inject(CONTENT_SERVICE) private readonly contentService: ClientProxy,
  ) {}

  @Get('health')
  getHealth() {
    return this.contentService
      .send('getAnalyticsHealth', {})
      .pipe(catchError(handleRpcCustomError));
  }

  @Get('summary')
  getSummary() {
    return this.contentService
      .send('getAnalyticsSummary', {})
      .pipe(catchError(handleRpcCustomError));
  }

  @Get('metrics')
  findMetrics(@Query() query: AnalyticsMetricsQueryDto) {
    return this.contentService
      .send('findAnalyticsMetrics', {
        limit: query.limit ?? 100,
      })
      .pipe(catchError(handleRpcCustomError));
  }

  @Get('snapshots')
  findSnapshots(@Query() query: AnalyticsSnapshotsQueryDto) {
    return this.contentService
      .send('findAnalyticsSnapshots', {
        limit: query.limit ?? 50,
      })
      .pipe(catchError(handleRpcCustomError));
  }

  @Get('config')
  getConfig() {
    return this.contentService
      .send('getAnalyticsConfig', {})
      .pipe(catchError(handleRpcCustomError));
  }

  @Post('config')
  upsertConfig(@Body() body: AnalyticsConfigUpsertDto) {
    return this.contentService
      .send('upsertAnalyticsConfig', body)
      .pipe(catchError(handleRpcCustomError));
  }

  @Post('workload/run')
  runWorkload(@Body() body: AnalyticsWorkloadDto) {
    return this.contentService
      .send('runAnalyticsWorkload', body ?? {})
      .pipe(catchError(handleRpcCustomError));
  }

  @Post('snapshot')
  triggerSnapshot(@Body() body: AnalyticsSnapshotDto) {
    return this.contentService
      .send('triggerAnalyticsSnapshot', body ?? {})
      .pipe(catchError(handleRpcCustomError));
  }

  @Post('export')
  exportSnapshot(@Body() body: AnalyticsExportDto) {
    return this.contentService
      .send('exportAnalyticsSnapshot', body ?? {})
      .pipe(catchError(handleRpcCustomError));
  }

  @Get('auth/google')
  async getGoogleAuthUrl(
    @Query() query: AnalyticsAuthGoogleQueryDto,
    @Res() res: AnalyticsRedirectResponse,
  ) {
    const response: AnalyticsGoogleAuthUrlResponse = await firstValueFrom(
      this.contentService
        .send<AnalyticsGoogleAuthUrlResponse, { state?: string }>(
          'getAnalyticsGoogleAuthUrl',
          {
            ...(query.state ? { state: query.state } : {}),
          },
        )
        .pipe(catchError(handleRpcCustomError)),
    );

    const url = this.extractGoogleAuthUrl(response);

    if (!url) {
      throw new BadRequestException(
        'No se recibió URL de OAuth desde content-ms',
      );
    }

    return res.redirect(url);
  }

  @Get('auth/google/callback')
  async exchangeGoogleCode(
    @Query() query: AnalyticsAuthCallbackQueryDto,
    @Res() res: AnalyticsHtmlResponse,
  ) {
    const exchangeResponse = await firstValueFrom(
      this.contentService
        .send<unknown, { code: string }>('exchangeAnalyticsGoogleCode', {
          code: query.code,
        })
        .pipe(catchError(handleRpcCustomError)),
    );

    const accessToken = this.extractAccessToken(exchangeResponse);

    const targetOrigin = this.resolveTargetOrigin();
    const fallbackUrl = this.resolveFallbackUrl(targetOrigin);

    this.logger.log('[Analytics OAuth Callback] Temporary debug logs', {
      hasAccessToken: Boolean(accessToken),
      targetOrigin,
      fallbackUrl,
    });

    // Allow popup communication with opener for OAuth callback page.
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');

    return res
      .type('html')
      .send(this.buildOAuthPopupHtml(this.readState(query), accessToken, undefined));
  }

  private extractGoogleAuthUrl(response: unknown): string | undefined {
    if (typeof response === 'string') {
      return response.trim() || undefined;
    }

    if (!response || typeof response !== 'object') {
      return undefined;
    }

    const candidate =
      (response as { url?: unknown }).url ??
      (response as { data?: { url?: unknown } }).data?.url;

    return typeof candidate === 'string' && candidate.trim()
      ? candidate
      : undefined;
  }

  private extractAccessToken(response: unknown): string | undefined {
    if (!response || typeof response !== 'object') return undefined;
    const r = response as Record<string, unknown>;
    const token =
      r['access_token'] ??
      (r['data'] as Record<string, unknown> | undefined)?.['access_token'];
    return typeof token === 'string' && token ? token : undefined;
  }

  private resolveTargetOrigin(): string {
    return new URL(envs.frontendUrl).origin;
  }

  private resolveFallbackUrl(targetOrigin: string): string {
    return envs.analyticsCallbackUrl || envs.frontendUrl || targetOrigin;
  }

  private buildOAuthPopupHtml(
    state?: string,
    accessToken?: string,
    error?: string,
  ): string {
    const targetOrigin = this.resolveTargetOrigin();
    const fallbackUrl = this.resolveFallbackUrl(targetOrigin);

    const serializedAccessToken = this.serializeForInlineScript(accessToken || '');
    const serializedState = this.serializeForInlineScript(state || '');
    const serializedError = this.serializeForInlineScript(error || '');
    const serializedTargetOrigin = this.serializeForInlineScript(targetOrigin);
    const serializedFallbackUrl = this.serializeForInlineScript(fallbackUrl);

    return `<!DOCTYPE html>
<html>
  <body>
    <script>
      (() => {
        const accessToken = ${serializedAccessToken};
        const state = ${serializedState};
        const error = ${serializedError};
        const targetOrigin = ${serializedTargetOrigin};
        const fallbackBase = ${serializedFallbackUrl};

        const hash = new URLSearchParams();
        if (accessToken) hash.set('access_token', accessToken);
        if (state) hash.set('state', state);
        if (error) hash.set('error', error);

        const fallback =
          fallbackBase + (fallbackBase.includes('#') ? '&' : '#') + hash.toString();

        const openerAvailable = Boolean(window.opener && !window.opener.closed);
        console.log('[Analytics OAuth Callback] openerAvailable', openerAvailable);

        try {
          if (window.opener && !window.opener.closed && accessToken) {
            window.opener.postMessage(
              {
                type: 'analytics-oauth-success',
                payload: { access_token: accessToken, state },
              },
              targetOrigin,
            );

            setTimeout(() => window.close(), 150);
            return;
          }
        } catch (e) {
          console.error('postMessage failed', e);
        }

        window.location.replace(fallback);
      })();
    </script>
  </body>
</html>`;
  }

  private readState(query: AnalyticsAuthCallbackQueryDto): string | undefined {
    const state = (query as AnalyticsAuthCallbackQueryDto & { state?: unknown })
      .state;
    return typeof state === 'string' ? state : undefined;
  }

  private serializeForInlineScript(value: unknown): string {
    return JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, (char) => {
      switch (char) {
        case '<':
          return '\\u003c';
        case '>':
          return '\\u003e';
        case '&':
          return '\\u0026';
        case '\u2028':
          return '\\u2028';
        case '\u2029':
          return '\\u2029';
        default:
          return char;
      }
    });
  }
}
