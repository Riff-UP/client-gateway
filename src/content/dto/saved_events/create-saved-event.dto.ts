import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateSavedEventDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  eventId!: string;

  @IsString()
  @IsNotEmpty()
  userId!: string;
}
