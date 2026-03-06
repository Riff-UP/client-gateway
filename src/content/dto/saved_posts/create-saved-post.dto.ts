import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateSavedPostDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  postId!: string;

  @IsString()
  @IsNotEmpty()
  userId!: string;
}
