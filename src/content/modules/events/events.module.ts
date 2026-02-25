import { Module } from '@nestjs/common';
import { EventsController } from '../../controllers';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CONTENT_SERVICE } from '../../../config/services.js';
import { envs } from '../../../config/index.js';

@Module({
  controllers: [EventsController],
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
export class EventsModule {}
