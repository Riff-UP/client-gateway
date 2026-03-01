import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { CreatePostDto, UpdatePostsDto } from '../../dto';
import { CONTENT_SERVICE } from '../../../config/services.js';
import { ClientProxy } from '@nestjs/microservices';
import { handleRpcCustomError } from '../../../common';
import { catchError } from 'rxjs';

@Controller('posts')
export class PostsController {
  constructor(
    @Inject(CONTENT_SERVICE) private readonly contentService: ClientProxy,
  ) {}

  @Post()
  create(@Body() createPostsDto: CreatePostDto) {
    return this.contentService.send('createPost', createPostsDto || {}).pipe(
      catchError(handleRpcCustomError)
    )
  }

  @Get()
  findAll() {
    return this.contentService.send('findAllPosts', {}).pipe(
      catchError(handleRpcCustomError)
    )
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contentService.send('findOnePost', id).pipe(
      catchError(handleRpcCustomError)
    )
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostsDto: UpdatePostsDto) {
    return this.contentService.send('updatePost', { id, ...updatePostsDto }).pipe(
      catchError(handleRpcCustomError)
    )
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contentService.send('removePost', id).pipe(
      catchError(handleRpcCustomError)
    )
  }
}
