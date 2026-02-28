import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USERS_SERVICE } from '../../../config/services.js';
import { CreateUFDto } from '../../dto/index.js';
import { handleRpcCustomError } from '../../../common/index.js';

@Controller('user-follows')
export class UserFollowsController {
  constructor(
    @Inject(USERS_SERVICE) private readonly userFollowsClient: ClientProxy,
  ) {}

  // POST /user-follows
  @Post()
  toggleFollow(@Body() createUFDto: CreateUFDto) {
    return this.userFollowsClient.send('toggleUserFollow', createUFDto).pipe(
      handleRpcCustomError()
    )
  }

  // GET /follows/:followerId
  @Get(':followerId')
  findAll(@Param('followerId') followerId: string) {
    return this.userFollowsClient.send('findAllUserFollows', followerId).pipe(
      handleRpcCustomError()
    )
  }

  // GET /follows/:followerId/:followedId
  @Get(':followerId/:followedId')
  findOne(
    @Param('followerId') followerId: string,
    @Param('followedId') followedId: string,
  ) {
    return this.userFollowsClient.send('findOneUserFollow', {
      followerId,
      followedId,
    }).pipe(
      handleRpcCustomError()
    )
  }
}
