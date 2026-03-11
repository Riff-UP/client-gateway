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
  AnalyticsMetricsQueryDto,
  AnalyticsSnapshotsQueryDto,
  AnalyticsWorkloadDto,
} from '../../dto';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;
  let clientProxy: Pick<ClientProxy, 'send'>;
  let sendMock: jest.Mock;
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
    sendMock = jest.fn().mockReturnValue(of({ ok: true }));
    clientProxy = {
      send: sendMock,
    };
    controller = new AnalyticsController(clientProxy as ClientProxy);
  });

  it('reenvía health al pattern RPC correcto', async () => {
    await expect(lastValueFrom(controller.getHealth())).resolves.toEqual({
      ok: true,
    });
    expect(sendMock).toHaveBeenCalledWith('getAnalyticsHealth', {});
  });

  it('usa el límite default para metrics cuando no llega query', async () => {
    const query = await transform({}, AnalyticsMetricsQueryDto, 'query');

    await lastValueFrom(controller.findMetrics(query));

    expect(sendMock).toHaveBeenCalledWith('findAnalyticsMetrics', {
      limit: 100,
    });
  });

  it('transforma y reenvía el límite de snapshots', async () => {
    const query = await transform(
      { limit: '25' },
      AnalyticsSnapshotsQueryDto,
      'query',
    );

    await lastValueFrom(controller.findSnapshots(query));

    expect(sendMock).toHaveBeenCalledWith('findAnalyticsSnapshots', {
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
    sendMock.mockReturnValueOnce(
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

    expect(sendMock).toHaveBeenCalledWith('getAnalyticsGoogleAuthUrl', {
      state: 'riff-benchmark-view',
    });
    expect(response.redirect).toHaveBeenCalledWith(
      'https://accounts.google.com/o/oauth2/v2/auth?client_id=test',
    );
  });

  it('falla si content-ms no devuelve una URL OAuth usable', async () => {
    sendMock.mockReturnValueOnce(of({ ok: true }));
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

  it('reenvía el code del callback OAuth y responde HTML para cerrar el popup', async () => {
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
    const response: Pick<Response, 'type' | 'send'> = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnValue('html-sent'),
    };

    await expect(controller.exchangeGoogleCode(query, response)).resolves.toBe(
      'html-sent',
    );

    expect(sendMock).toHaveBeenCalledWith('exchangeAnalyticsGoogleCode', {
      code: 'oauth-code-123',
    });
    expect(response.type).toHaveBeenCalledWith('html');
    expect(response.send).toHaveBeenCalledWith(
      expect.stringContaining('analytics-oauth-success'),
    );
    expect(response.send).toHaveBeenCalledWith(
      expect.stringContaining('window.close()'),
    );
    expect(response.send).toHaveBeenCalledWith(
      expect.stringContaining('"state":"riff-benchmark-view"'),
    );
  });
});
