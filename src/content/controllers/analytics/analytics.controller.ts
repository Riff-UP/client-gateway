import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { handleRpcCustomError } from '../../../common';
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

@Controller('analytics')
export class AnalyticsController {
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
  getGoogleAuthUrl(@Query() query: AnalyticsAuthGoogleQueryDto) {
    return this.contentService
      .send('getAnalyticsGoogleAuthUrl', {
        ...(query.state ? { state: query.state } : {}),
      })
      .pipe(catchError(handleRpcCustomError));
  }

  @Get('auth/google/callback')
  exchangeGoogleCode(@Query() query: AnalyticsAuthCallbackQueryDto) {
    return this.contentService
      .send('exchangeAnalyticsGoogleCode', {
        code: query.code,
      })
      .pipe(catchError(handleRpcCustomError));
  }
}
