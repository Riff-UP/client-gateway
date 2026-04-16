import { Transform } from 'class-transformer';
import { IsString, Length, Matches } from 'class-validator';

export class TwoFactorCodeDto {
  @Transform(({ value }) => String(value ?? '').replace(/\s+/g, ''))
  @IsString()
  @Length(6, 6)
  @Matches(/^\d{6}$/)
  code: string;
}
