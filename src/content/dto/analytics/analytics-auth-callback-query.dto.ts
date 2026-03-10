import { IsNotEmpty, IsString } from 'class-validator';

export class AnalyticsAuthCallbackQueryDto {
  @IsString()
  @IsNotEmpty()
  code!: string;
}
