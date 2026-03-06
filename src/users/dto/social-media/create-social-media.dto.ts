import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSMDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  platform!: string;

  @IsString()
  @IsNotEmpty()
  url!: string;

  @IsString()
  @IsOptional()
  username?: string;
}
