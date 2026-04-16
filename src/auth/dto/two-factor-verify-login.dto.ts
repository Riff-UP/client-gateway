import { Transform } from 'class-transformer';
import { IsJWT, IsString, Length, Matches } from 'class-validator';

export class TwoFactorVerifyLoginDto {
  @Transform(({ value }) => String(value ?? '').trim())
  @IsJWT()
  tempToken: string;

  @Transform(({ value }) => String(value ?? '').replace(/\s+/g, ''))
  @IsString()
  @Length(6, 6)
  @Matches(/^\d{6}$/)
  code: string;
}
