import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePRDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  token!: string;

  @IsDateString()
  @IsNotEmpty()
  expiresAt!: string;

  @IsBoolean()
  @IsOptional()
  used?: boolean;
}
