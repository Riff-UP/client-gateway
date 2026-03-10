import { IsOptional, IsPositive, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class AnalyticsSnapshotsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Max(1000)
  limit?: number;
}
