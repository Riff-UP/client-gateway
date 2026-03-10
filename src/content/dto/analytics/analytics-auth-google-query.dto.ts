import { IsOptional, IsString } from 'class-validator';

export class AnalyticsAuthGoogleQueryDto {
  @IsOptional()
  @IsString()
  state?: string;
}
