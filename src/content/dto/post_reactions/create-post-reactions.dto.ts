import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostReactionsDto {
  // Frontend puede enviar userId o sql_user_id - el backend mapea
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  sql_user_id?: string;

  // Frontend puede enviar postId o post_id - el backend mapea
  @IsString()
  @IsOptional()
  postId?: string;

  @IsString()
  @IsOptional()
  post_id?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['like', 'love', 'fire', 'applause'])
  type!: string;
}
