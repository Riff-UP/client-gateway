import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsOptional() // ← Opcional porque el gateway lo agrega desde el JWT
  sql_user_id?: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  event_date!: string;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsArray()
  @IsOptional()
  followers?: string[];
}
