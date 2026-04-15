import { IsJWT, IsString, Length, Matches } from 'class-validator';

export class TwoFactorVerifyLoginDto {
  @IsJWT()
  tempToken: string;

  @IsString()
  @Length(6, 6)
  @Matches(/^\d{6}$/)
  code: string;
}
