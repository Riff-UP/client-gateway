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
import { CreatePostsDto, UpdatePostsDto } from '../../dto';
import { CONTENT_SERVICE } from '../../../config/services.js';
import { ClientProxy } from '@nestjs/microservices';
import { handleRpcCustomError } from '../../../common';

@Controller('posts')
export class PostsController {
  constructor(
    @Inject(CONTENT_SERVICE) private readonly contentService: ClientProxy,
  ) {}

  @Post()
  create(@Body() createPostsDto: CreatePostsDto) {
    return this.contentService.send('createPost', createPostsDto || {}).pipe(
      handleRpcCustomError()
    )
  }

  @Get()
  findAll() {
    return this.contentService.send('findAllPosts', {}).pipe(
      handleRpcCustomError()
    )
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contentService.send('findOnePost', id).pipe(
      handleRpcCustomError()
    )
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostsDto: UpdatePostsDto) {
    return this.contentService.send('updatePost', { id, ...updatePostsDto }).pipe(
      handleRpcCustomError()
    )
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contentService.send('removePost', id).pipe(
      handleRpcCustomError()
    )
  }
}
