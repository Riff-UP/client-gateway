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
import { USERS_SERVICE } from '../../../config/services.js';
import { CreateUFDto } from '../../dto/index.js';
import { handleRpcCustomError } from '../../../common/index.js';
import { catchError } from 'rxjs';

@Controller('follows')
export class UserFollowsController {
  constructor(
    @Inject(USERS_SERVICE) private readonly userFollowsClient: ClientProxy,
  ) {}

  // POST /user-follows
  @Post()
  toggleFollow(@Body() createUFDto: CreateUFDto) {
    return this.userFollowsClient
      .send('toggleUserFollow', createUFDto)
      .pipe(catchError(handleRpcCustomError));
  }

  // GET /user-follows?followingId=<userId>  → seguidores de un artista
  // GET /user-follows?followerId=<userId>   → a quién sigue un usuario
  @Get()
  findAll(
    @Query('followingId') followingId?: string,
    @Query('followerId') followerId?: string,
  ) {
    if (followingId) {
      return this.userFollowsClient
        .send('findFollowersByUser', { followingId })
        .pipe(catchError(handleRpcCustomError));
    }
    if (followerId) {
      return this.userFollowsClient
        .send('findFollowingByUser', { followerId })
        .pipe(catchError(handleRpcCustomError));
    }
    return this.userFollowsClient
      .send('findAllUserFollows', {})
      .pipe(catchError(handleRpcCustomError));
  }

  // GET /user-follows/followers/:userId → seguidores de un usuario (ruta explícita)
  @Get('followers/:userId')
  findFollowers(@Param('userId') userId: string) {
    return this.userFollowsClient
      .send('findFollowersByUser', { followingId: userId })
      .pipe(catchError(handleRpcCustomError));
  }

  // GET /user-follows/following/:userId → usuarios que sigue un usuario (ruta explícita)
  @Get('following/:userId')
  findFollowing(@Param('userId') userId: string) {
    return this.userFollowsClient
      .send('findFollowingByUser', { followerId: userId })
      .pipe(catchError(handleRpcCustomError));
  }

  // GET /user-follows/:followerId/:followedId → verificar si un usuario sigue a otro
  @Get(':followerId/:followedId')
  findOne(
    @Param('followerId') followerId: string,
    @Param('followedId') followedId: string,
  ) {
    return this.userFollowsClient
      .send('findOneUserFollow', { followerId, followedId })
      .pipe(catchError(handleRpcCustomError));
  }

  // GET /user-follows/:followerId → follows de un usuario (compatibilidad)
  @Get(':followerId')
  findByFollower(@Param('followerId') followerId: string) {
    return this.userFollowsClient
      .send('findFollowingByUser', { followerId })
      .pipe(catchError(handleRpcCustomError));
  }

  // DELETE /user-follows?followerId=<id>&followedId=<id> → dejar de seguir
  @Delete()
  unfollow(
    @Query('followerId') followerId: string,
    @Query('followedId') followedId: string,
  ) {
    return this.userFollowsClient
      .send('removeUserFollow', { followerId, followedId })
      .pipe(catchError(handleRpcCustomError));
  }

  // DELETE /user-follows/:id → eliminar follow por ID
  @Delete(':id')
  removeById(@Param('id') id: string) {
    return this.userFollowsClient
      .send('removeUserFollowById', { id })
      .pipe(catchError(handleRpcCustomError));
  }
}
