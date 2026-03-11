import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AnalyticsAuthCallbackQueryDto {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsOptional()
  @IsString()
  state?: string;
}
