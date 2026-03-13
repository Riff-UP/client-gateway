import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEventReviewsDto {
  @IsString()
  @IsNotEmpty()
  event_id!: string;

  @IsString()
  @IsOptional()
  sql_user_id?: string;

  @IsNumber()
  @IsNotEmpty()
  rating!: number;
}
