import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class AnalyticsConfigUpsertDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  variableName!: string;

  @IsString()
  @IsNotEmpty()
  variableValue!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
