import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsPositive, Max } from 'class-validator';

export class AnalyticsWorkloadDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Max(100000)
  iterations?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  resetStats?: boolean;
}
