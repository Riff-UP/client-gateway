import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsPositive,
  IsString,
  Max,
} from 'class-validator';

export class AnalyticsSnapshotDto {
  @IsOptional()
  @IsString()
  accessToken?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  executeWorkload?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Max(100000)
  iterations?: number;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Max(1000)
  limit?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  resetStatsBeforeRun?: boolean;
}
