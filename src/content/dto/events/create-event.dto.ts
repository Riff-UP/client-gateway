import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common';

export class CreateEventDto {
  
  @IsString()
  title!: string;

  @IsString()
  @IsOptional()
  description!: string;

  @IsString()
  @IsNotEmpty()
  event_date!: string;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsArray()
  @IsOptional()
  followers!: string[];
}

export class EventPaginationDto extends PaginationDto {
  @IsOptional()
  @IsString()
  userId?: string;
}