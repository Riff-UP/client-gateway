import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CONTENT_SERVICE } from '../../../config/services.js';
import { EventReviewsController } from '../../controllers';
import { envs } from '../../../config/index.js';

@Module({
  controllers: [EventReviewsController],
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
export class EventReviewsModule {}
