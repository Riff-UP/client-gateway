import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Patch,
  Param,
  Inject,
  Query,
} from '@nestjs/common';
import { NOTIFICATIONS_SERVICE } from '../config/services.js';
import { ClientProxy } from '@nestjs/microservices';
import { CreateNotificationDto, UpdateNotificationDto } from './dto/index.js';
import { handleRpcCustomError, PaginationDto } from '../common/index.js';
import { catchError } from 'rxjs';

@Controller('notifications')
export class NotificationsController {
  constructor(
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsClient: ClientProxy,
  ) { }

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsClient
      .send('createNotification', createNotificationDto)
      .pipe(catchError(handleRpcCustomError));
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.notificationsClient
      .send('findAllNotifications', paginationDto)
      .pipe(catchError(handleRpcCustomError));
  }

  @Get('user/:userIdReceiver')
  findByUser(
    @Param('userIdReceiver') userIdReceiver: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.notificationsClient
      .send('findNotificationsByUser', {
        userIdReceiver,
        pagination: paginationDto,
      })
      .pipe(catchError(handleRpcCustomError));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsClient
      .send('findOneNotification', id)
      .pipe(catchError(handleRpcCustomError));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsClient
      .send('updateNotification', { id, ...updateNotificationDto })
      .pipe(catchError(handleRpcCustomError));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsClient
      .send('removeNotification', id)
      .pipe(catchError(handleRpcCustomError));
  }
}
