import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query,
} from '@nestjs/common';
import { CreatePostDto, UpdatePostsDto } from '../../dto';
import { CONTENT_SERVICE } from '../../../config/services.js';
import { ClientProxy } from '@nestjs/microservices';
import { handleRpcCustomError, PaginationDto } from '../../../common';
import { catchError, firstValueFrom } from 'rxjs';
import { Logger } from '@nestjs/common';

@Controller('posts')
export class PostsController {
  constructor(
    @Inject(CONTENT_SERVICE) private readonly contentService: ClientProxy,
  ) { }

  @Post()
  async create(@Body() createPostsDto: CreatePostDto) {
    try {
      const result = await firstValueFrom(
        this.contentService.send('createPost', createPostsDto || {}),
      );
      return result;
    } catch (err) {
      const logger = new Logger('PostsController');
      logger.error('Error calling content service createPost', err?.message || err, err?.stack);
      throw err;
    }
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.contentService
      .send('findAllPosts', paginationDto)
      .pipe(catchError(handleRpcCustomError));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contentService
      .send('findOnePost', id)
      .pipe(catchError(handleRpcCustomError));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostsDto: UpdatePostsDto) {
    return this.contentService
      .send('updatePost', { id, ...updatePostsDto })
      .pipe(catchError(handleRpcCustomError));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contentService
      .send('removePost', id)
      .pipe(catchError(handleRpcCustomError));
  }
}
