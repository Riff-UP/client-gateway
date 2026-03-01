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
import { catchError } from 'rxjs';

@Controller('notifications')
export class NotificationsController {
  constructor(
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsClient: ClientProxy,
  ) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsClient
      .send('createNotification', createNotificationDto)
      .pipe(catchError(handleRpcCustomError));
  }

  @Get()
  findAll() {
    return this.notificationsClient
      .send('findAllNotifications', {})
      .pipe(catchError(handleRpcCustomError));
  }

  @Get('user/:userIdReceiver')
  findByUser(@Param('userIdReceiver') userIdReceiver: string) {
    return this.notificationsClient
      .send('findNotificationsByUser', userIdReceiver)
      .pipe(catchError(handleRpcCustomError));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsClient
      .send('findOneNotification', id)
      .pipe(catchError(handleRpcCustomError));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsClient
      .send('removeNotification', id)
      .pipe(catchError(handleRpcCustomError));
  }
}
