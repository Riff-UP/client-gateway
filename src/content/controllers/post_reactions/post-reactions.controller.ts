import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CONTENT_SERVICE } from '../../../config/services.js';
import { CreatePostReactionsDto } from '../../dto/index.js';
import { handleRpcCustomError } from '../../../common/index.js';

@Controller('posts/reactions')
export class PostReactionsController {
  constructor(
    @Inject(CONTENT_SERVICE) private readonly postReactionsService: ClientProxy,
  ) {}

  @Post()
  create(@Body() createPostReactionsDto: CreatePostReactionsDto) {
    return this.postReactionsService.send(
      'createPostReaction',
      createPostReactionsDto || {},
    ).pipe(
      handleRpcCustomError()
    )
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postReactionsService.send('removePostReaction', id).pipe(
      handleRpcCustomError()
    )
  }
}
