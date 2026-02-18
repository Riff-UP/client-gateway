import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USERS_SERVICE } from 'src/config/services';
import { CreateUFDto } from 'src/users/dto';

@Controller('follows')
export class UserFollowsController {
  constructor(
    @Inject(USERS_SERVICE) private readonly userFollowsClient: ClientProxy,
  ) {}

  // POST /follows/toggle
  @Post('toggle')
  toggleFollow(@Body() createUFDto: CreateUFDto) {
    return this.userFollowsClient.send('toggleUserFollow', createUFDto);
  }

  // GET /follows/:followerId
  @Get(':followerId')
  findAll(@Param('followerId') followerId: string) {
    return this.userFollowsClient.send('findAllUserFollows', followerId);
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
    });
  }
}