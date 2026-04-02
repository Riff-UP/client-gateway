import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import type { Response } from 'express';
import { lastValueFrom, of } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

jest.mock('../../../common', () => ({
  handleRpcCustomError: (error: unknown) => {
    throw error;
  },
}));

import { AnalyticsController } from './analytics.controller';
import {
  AnalyticsAuthCallbackQueryDto,
  AnalyticsAuthGoogleQueryDto,
  AnalyticsHypothesisDailyQueryDto,
  AnalyticsMetricsQueryDto,
  AnalyticsSnapshotsQueryDto,
  AnalyticsWorkloadDto,
} from '../../dto';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;
  let contentClientProxy: Pick<ClientProxy, 'send'>;
  let usersClientProxy: Pick<ClientProxy, 'send'>;
  let contentSendMock: jest.Mock;
  let usersSendMock: jest.Mock;
  const validationPipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  });

  const transform = async <T>(
    value: unknown,
    metatype: new () => T,
    type: ArgumentMetadata['type'],
  ) =>
    validationPipe.transform(value, {
      type,
      metatype,
      data: undefined,
    }) as Promise<T>;

  beforeEach(() => {
    contentSendMock = jest.fn().mockReturnValue(of({ ok: true }));
    usersSendMock = jest.fn().mockReturnValue(of({ ok: true }));
    contentClientProxy = {
      send: contentSendMock,
    };
    usersClientProxy = {
      send: usersSendMock,
    };
    controller = new AnalyticsController(
      contentClientProxy as ClientProxy,
      usersClientProxy as ClientProxy,
    );
  });

  it('reenvía health al pattern RPC correcto', async () => {
    await expect(lastValueFrom(controller.getHealth())).resolves.toEqual({
      ok: true,
    });
    expect(contentSendMock).toHaveBeenCalledWith('getAnalyticsHealth', {});
  });

  it('usa el límite default para metrics cuando no llega query', async () => {
    const query = await transform({}, AnalyticsMetricsQueryDto, 'query');

    await lastValueFrom(controller.findMetrics(query));

    expect(contentSendMock).toHaveBeenCalledWith('findAnalyticsMetrics', {
      limit: 100,
    });
  });

  it('reenvía hypothesis/daily a users-ms con scope default global', async () => {
    const query = await transform(
      {
        from: '2026-01-01T00:00:00.000Z',
        to: '2026-01-07T23:59:59.999Z',
      },
      AnalyticsHypothesisDailyQueryDto,
      'query',
    );

    await lastValueFrom(controller.getHypothesisDaily(query));

    expect(usersSendMock).toHaveBeenCalledWith('analyticsHypothesisDaily', {
      from: '2026-01-01T00:00:00.000Z',
      to: '2026-01-07T23:59:59.999Z',
      scope: 'global',
    });
  });

  it('exige userId cuando scope=user en hypothesis/daily', async () => {
    await expect(
      transform(
        {
          from: '2026-01-01T00:00:00.000Z',
          to: '2026-01-07T23:59:59.999Z',
          scope: 'user',
        },
        AnalyticsHypothesisDailyQueryDto,
        'query',
      ),
    ).rejects.toMatchObject({
      response: {
        message: ['userId must be a UUID'],
      },
    });
  });

  it('transforma y reenvía el límite de snapshots', async () => {
    const query = await transform(
      { limit: '25' },
      AnalyticsSnapshotsQueryDto,
      'query',
    );

    await lastValueFrom(controller.findSnapshots(query));

    expect(contentSendMock).toHaveBeenCalledWith('findAnalyticsSnapshots', {
      limit: 25,
    });
  });

  it('rechaza payloads extra en workload como haría el ValidationPipe global', async () => {
    await expect(
      transform(
        {
          iterations: '5',
          resetStats: 'true',
          unexpected: 'boom',
        },
        AnalyticsWorkloadDto,
        'body',
      ),
    ).rejects.toMatchObject({
      response: {
        message: ['property unexpected should not exist'],
      },
    });
  });

  it('redirige a la URL OAuth devuelta por content-ms', async () => {
    contentSendMock.mockReturnValueOnce(
      of({
        url: 'https://accounts.google.com/o/oauth2/v2/auth?client_id=test',
      }),
    );
    const query = await transform(
      { state: 'riff-benchmark-view' },
      AnalyticsAuthGoogleQueryDto,
      'query',
    );
    const response: Pick<Response, 'redirect'> = {
      redirect: jest.fn().mockReturnValue('redirected'),
    };

    await expect(controller.getGoogleAuthUrl(query, response)).resolves.toBe(
      'redirected',
    );

    expect(contentSendMock).toHaveBeenCalledWith('getAnalyticsGoogleAuthUrl', {
      state: 'riff-benchmark-view',
    });
    expect(response.redirect).toHaveBeenCalledWith(
      'https://accounts.google.com/o/oauth2/v2/auth?client_id=test',
    );
  });

  it('falla si content-ms no devuelve una URL OAuth usable', async () => {
    contentSendMock.mockReturnValueOnce(of({ ok: true }));
    const query = await transform({}, AnalyticsAuthGoogleQueryDto, 'query');
    const response: Pick<Response, 'redirect'> = {
      redirect: jest.fn(),
    };

    await expect(
      controller.getGoogleAuthUrl(query, response),
    ).rejects.toMatchObject({
      response: {
        message: 'No se recibió URL de OAuth desde content-ms',
      },
    });

    expect(response.redirect).not.toHaveBeenCalled();
  });

  it('exige code en el callback OAuth', () => {
    const dto = plainToInstance(AnalyticsAuthCallbackQueryDto, {});
    const errors = validateSync(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('code');
  });

  it('acepta parámetros extra conocidos del callback de Google', async () => {
    const query = await transform(
      {
        code: 'oauth-code-123',
        state: 'riff-benchmark-view',
        iss: 'https://accounts.google.com',
        scope: 'openid email profile',
        authuser: '0',
        prompt: 'consent',
        hd: 'riffmx.lat',
      },
      AnalyticsAuthCallbackQueryDto,
      'query',
    );

    expect(query).toMatchObject({
      code: 'oauth-code-123',
      state: 'riff-benchmark-view',
      iss: 'https://accounts.google.com',
      scope: 'openid email profile',
      authuser: '0',
      prompt: 'consent',
      hd: 'riffmx.lat',
    });
  });

  it('sigue rechazando parámetros desconocidos en el callback OAuth', async () => {
    await expect(
      transform(
        {
          code: 'oauth-code-123',
          state: 'riff-benchmark-view',
          unknown: 'boom',
        },
        AnalyticsAuthCallbackQueryDto,
        'query',
      ),
    ).rejects.toMatchObject({
      response: {
        message: ['property unknown should not exist'],
      },
    });
  });

  it('reenvía el code del callback OAuth y responde HTML para popup/hash fallback', async () => {
    const query = await transform(
      {
        code: 'oauth-code-123',
        state: 'riff-benchmark-view',
        iss: 'https://accounts.google.com',
        scope: 'openid email profile',
      },
      AnalyticsAuthCallbackQueryDto,
      'query',
    );
    const response: Pick<Response, 'type' | 'send' | 'setHeader'> = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnValue('html-sent'),
      setHeader: jest.fn().mockReturnThis(),
    };

    await expect(controller.exchangeGoogleCode(query, response)).resolves.toBe(
      'html-sent',
    );

    expect(contentSendMock).toHaveBeenCalledWith('exchangeAnalyticsGoogleCode', {
      code: 'oauth-code-123',
    });
    expect(response.setHeader).toHaveBeenCalledWith(
      'Cross-Origin-Opener-Policy',
      'same-origin-allow-popups',
    );
    expect(response.type).toHaveBeenCalledWith('html');
    expect(response.send).toHaveBeenCalledWith(
      expect.stringContaining('analytics-oauth-success'),
    );
    expect(response.send).toHaveBeenCalledWith(
      expect.stringContaining('window.location.replace(fallback)'),
    );
    expect(response.send).toHaveBeenCalledWith(
      expect.stringContaining('const state = "riff-benchmark-view";'),
    );
    expect(response.send).toHaveBeenCalledWith(
      expect.stringContaining("console.log('[Analytics OAuth Callback] openerAvailable'"),
    );
  });
});
