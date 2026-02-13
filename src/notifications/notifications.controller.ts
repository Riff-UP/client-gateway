import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { NOTIFICATIONS_SERVICE } from 'src/config/services';
import { ClientProxy } from '@nestjs/microservices';
import { CreateNotificationDto, UpdateNotificationDto } from './dto/index.js';

@Controller('notifications')
export class NotificationsController {
  constructor(
    @Inject(NOTIFICATIONS_SERVICE) private readonly notificationsClient : ClientProxy
  ) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsClient.send('createNotification', createNotificationDto || {})
  }

  @Get()
  findAll() {
    return this.notificationsClient.send('findAllNotifications', {})
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsClient.send('findOneNotification', id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotificationDto: CreateNotificationDto) {
    return this.notificationsClient.send('updateNotification', {id, ...updateNotificationDto})
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsClient.send('removeNotification', id)
  }
}
