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
import { CreateSavedPostDto } from '../../dto';
import { handleRpcCustomError } from '../../../common/index.js';

@Controller('posts/saved')
export class SavedPostsController {
  constructor(
    @Inject(CONTENT_SERVICE) private readonly savedPostsService: ClientProxy,
  ) {}

  @Post()
  create(@Body() createSavedPostDto: CreateSavedPostDto) {
    return this.savedPostsService.send(
      'createSavedPost',
      createSavedPostDto || {},
    ).pipe(
      handleRpcCustomError()
    )
  }

  @Get()
  findAll() {
    return this.savedPostsService.send('findAllSavedPosts', {}).pipe(
      handleRpcCustomError()
    )
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.savedPostsService.send('removeSavedPost', id).pipe(
      handleRpcCustomError()
    )
  }
}
