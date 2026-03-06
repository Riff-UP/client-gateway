import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class MailDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  mail: string;
}
