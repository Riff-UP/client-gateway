import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AnalyticsAuthCallbackQueryDto {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  iss?: string;

  @IsOptional()
  @IsString()
  scope?: string;

  @IsOptional()
  @IsString()
  authuser?: string;

  @IsOptional()
  @IsString()
  prompt?: string;

  @IsOptional()
  @IsString()
  hd?: string;
}
