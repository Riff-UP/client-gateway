import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Inject,
} from '@nestjs/common';
import { NOTIFICATIONS_SERVICE } from '../config/services.js';
import { ClientProxy } from '@nestjs/microservices';
import { CreateNotificationDto } from './dto/index.js';
import { handleRpcCustomError } from '../common/index.js';

@Controller('notifications')
export class NotificationsController {
  constructor(
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsClient: ClientProxy,
  ) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsClient.send(
      'createNotification',
      createNotificationDto,
    ).pipe(
      handleRpcCustomError()
    )
  }

  @Get(':userIdReceiver')
  findAll(@Param('userIdReceiver') userIdReceiver: string) {
    return this.notificationsClient.send(
      'findAllNotifications',
      userIdReceiver,
    ).pipe(
      handleRpcCustomError()
    )
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsClient.send('removeNotification', id).pipe(
      handleRpcCustomError()
    )
  }
}
