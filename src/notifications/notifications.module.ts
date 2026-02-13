import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NOTIFICATIONS_SERVICE } from 'src/config/services';
import { envs } from '../config/index.js';

@Module({
  controllers: [NotificationsController],
  providers: [],
  imports: [
    ClientsModule.register([
      {
        name: NOTIFICATIONS_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.notificationsMsHost,
          port: envs.notificationsMsPort
        }
      }
    ])
  ]
})
export class NotificationsModule {}
