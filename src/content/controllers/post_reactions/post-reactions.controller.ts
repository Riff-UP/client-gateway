import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CONTENT_SERVICE } from '../../../config/services.js';
import { CreatePostReactionsDto } from '../../dto/index.js';
import { handleRpcCustomError } from '../../../common/index.js';
import { catchError } from 'rxjs';

@Controller('posts/reactions')
export class PostReactionsController {
  constructor(
    @Inject(CONTENT_SERVICE) private readonly postReactionsService: ClientProxy,
  ) { }

  @Post()
  create(@Body() createPostReactionsDto: CreatePostReactionsDto) {
    return this.postReactionsService
      .send('createPostReaction', createPostReactionsDto || {})
      .pipe(catchError(handleRpcCustomError));
  }

  @Get('post/:postId')
  findByPost(@Param('postId') postId: string) {
    return this.postReactionsService
      .send('findReactionsByPost', { post_id: postId })
      .pipe(catchError(handleRpcCustomError));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postReactionsService
      .send('removePostReaction', id)
      .pipe(catchError(handleRpcCustomError));
  }
}
