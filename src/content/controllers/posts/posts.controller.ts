import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { CreatePostsDto, UpdatePostsDto } from '../../dto';
import { CONTENT_SERVICE } from 'src/config/services';
import { ClientProxy } from '@nestjs/microservices';

@Controller('posts')
export class PostsController {
  constructor(
    @Inject(CONTENT_SERVICE) private readonly contentService: ClientProxy
  ) {}

  @Post()
  create(@Body() createPostsDto: CreatePostsDto) {
    return this.contentService.send('createPost', createPostsDto || {});
  }

  @Get()
  findAll() {
    return this.contentService.send('findAllPosts', {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contentService.send('findOnePost', id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostsDto: UpdatePostsDto) {
    return this.contentService.send('updatePost', { id, ...updatePostsDto });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contentService.send('removePost', id)
  }
}
