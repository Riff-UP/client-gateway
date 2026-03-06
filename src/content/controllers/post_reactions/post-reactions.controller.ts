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
import { CreatePostReactionsDto } from '../../dto/index.js';
import { handleRpcCustomError } from '../../../common/index.js';
import { catchError } from 'rxjs';

@Controller('posts/reactions')
export class PostReactionsController {
  constructor(
    @Inject(CONTENT_SERVICE) private readonly postReactionsService: ClientProxy,
  ) {}

  @Post()
  create(@Body() createPostReactionsDto: CreatePostReactionsDto) {
    // Mapear userId → sql_user_id y postId → post_id (el backend acepta ambos)
    const payload = {
      ...createPostReactionsDto,
      sql_user_id: createPostReactionsDto.sql_user_id ?? createPostReactionsDto.userId,
      post_id: createPostReactionsDto.post_id ?? createPostReactionsDto.postId,
    };

    console.log('📤 POST /posts/reactions - payload:', payload);

    return this.postReactionsService
      .send('createPostReaction', payload)
      .pipe(catchError(handleRpcCustomError));
  }

  // GET /posts/reactions?userId=<userId>   → reacciones de un usuario
  // GET /posts/reactions?postId=<postId>   → reacciones de un post (alias)
  @Get()
  findByUser(
    @Query('userId') userId?: string,
    @Query('postId') postId?: string,
  ) {
    console.log('📥 GET /posts/reactions - userId:', userId, 'postId:', postId);

    if (postId) {
      return this.postReactionsService
        .send('findReactionsByPost', { post_id: postId })
        .pipe(catchError(handleRpcCustomError));
    }

    if (!userId) {
      console.warn('⚠️ userId no proporcionado, devolviendo array vacío');
      return [];
    }

    // El backend mapea userId a sql_user_id internamente
    return this.postReactionsService
      .send('findReactionsByUser', { userId })
      .pipe(catchError(handleRpcCustomError));
  }

  // GET /posts/reactions/post/:postId → reacciones de un post por param
  @Get('post/:postId')
  findByPost(@Param('postId') postId: string) {
    return this.postReactionsService
      .send('findReactionsByPost', { post_id: postId })
      .pipe(catchError(handleRpcCustomError));
  }

  // DELETE /posts/reactions?userId=<userId>&postId=<postId> → eliminar reacción de un usuario a un post
  @Delete()
  removeByUserAndPost(
    @Query('userId') userId?: string,
    @Query('postId') postId?: string,
  ) {
    if (userId && postId) {
      return this.postReactionsService
        .send('removePostReactionByUserAndPost', { userId, postId })
        .pipe(catchError(handleRpcCustomError));
    }
    console.warn('⚠️ Se requiere userId y postId para eliminar la reacción');
    return [];
  }

  // DELETE /posts/reactions/:id → eliminar reacción por su ID
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postReactionsService
      .send('removePostReaction', id)
      .pipe(catchError(handleRpcCustomError));
  }
}
