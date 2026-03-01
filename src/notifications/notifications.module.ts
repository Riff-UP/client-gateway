import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NOTIFICATIONS_SERVICE } from '../config/services.js';
import { envs } from '../config/index.js';

@Module({
  controllers: [NotificationsController],
  providers: [],
  imports: [
    ClientsModule.register([
      {
        name: NOTIFICATIONS_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [envs.rabbitUrl],
          queue: 'notifications_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
})
export class NotificationsModule {}