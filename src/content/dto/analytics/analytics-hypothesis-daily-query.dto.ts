import { IsDateString, IsIn, IsOptional, IsUUID, ValidateIf } from 'class-validator';

export class AnalyticsHypothesisDailyQueryDto {
  @IsDateString()
  from!: string;

  @IsDateString()
  to!: string;

  @IsOptional()
  @IsIn(['global', 'user'])
  scope?: 'global' | 'user';

  @ValidateIf((dto: AnalyticsHypothesisDailyQueryDto) => dto.scope === 'user')
  @IsUUID()
  userId?: string;
}