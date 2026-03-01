import { IsNotEmpty, IsString } from "class-validator";

export class CreateSMDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  url!: string;
}