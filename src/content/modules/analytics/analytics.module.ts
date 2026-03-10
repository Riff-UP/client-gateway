import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from '../../../config';
import { CONTENT_SERVICE } from '../../../config/services';
import { AnalyticsController } from '../../controllers';

@Module({
  controllers: [AnalyticsController],
  imports: [
    ClientsModule.register([
      {
        name: CONTENT_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.contentMsHost,
          port: envs.contentMsPort,
        },
      },
    ]),
  ],
})
export class AnalyticsModule {}
