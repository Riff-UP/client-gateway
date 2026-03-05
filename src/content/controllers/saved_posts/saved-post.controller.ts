import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CONTENT_SERVICE } from '../../../config/services.js';
import { CreateSavedPostDto } from '../../dto';
import { handleRpcCustomError } from '../../../common/index.js';
import { catchError } from 'rxjs';

@Controller('posts/saved')
export class SavedPostsController {
  constructor(
    @Inject(CONTENT_SERVICE) private readonly savedPostsService: ClientProxy,
  ) {}

  @Post()
  create(@Body() createSavedPostDto: CreateSavedPostDto) {
    return this.savedPostsService
      .send('createSavedPost', createSavedPostDto || {})
      .pipe(catchError(handleRpcCustomError));
  }

  @Get()
  findAll(@Query('userId') userId?: string) {
    return this.savedPostsService
      .send('findAllSavedPosts', userId ? { userId } : {})
      .pipe(catchError(handleRpcCustomError));
  }

  @Get('user/:sqlUserId')
  findByUser(@Param('sqlUserId') sqlUserId: string) {
    return this.savedPostsService
      .send('findSavedPostsByUser', { sql_user_id: sqlUserId })
      .pipe(catchError(handleRpcCustomError));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.savedPostsService
      .send('removeSavedPost', id)
      .pipe(catchError(handleRpcCustomError));
  }
}
