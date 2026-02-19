import { Controller, Get, Post, Body, Delete, Param, Inject } from '@nestjs/common';
import { NOTIFICATIONS_SERVICE } from 'src/config/services';
import { ClientProxy } from '@nestjs/microservices';
import { CreateNotificationDto } from './dto/index.js';

@Controller('notifications')
export class NotificationsController {
  constructor(
    @Inject(NOTIFICATIONS_SERVICE) private readonly notificationsClient: ClientProxy
  ) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsClient.send('createNotification', createNotificationDto);
  }

  @Get(':userIdReceiver')
  findAll(@Param('userIdReceiver') userIdReceiver: string) {
    return this.notificationsClient.send('findAllNotifications', userIdReceiver);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsClient.send('removeNotification', id);
  }
}