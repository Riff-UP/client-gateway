import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-posts.dto';

export class UpdatePostsDto extends PartialType(CreatePostDto) {}
