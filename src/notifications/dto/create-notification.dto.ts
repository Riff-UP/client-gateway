// src/notifications/dto/create-notification.dto.ts
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum NotificationType {
  EVENT_REMINDER = 'EVENT_REMINDER',
  EVENT_UPDATE = 'EVENT_UPDATE',
  EVENT_CANCELLED = 'EVENT_CANCELLED',
  NEW_EVENT = 'NEW_EVENT',
}

export class CreateNotificationDto {

  @IsString()
  @IsNotEmpty()
  userIdReceiver!: string;

  @IsEnum(NotificationType)
  type!: NotificationType;

  @IsString()
  @IsNotEmpty()
  message!: string;
}