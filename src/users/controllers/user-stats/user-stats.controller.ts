import {
  Controller,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USERS_SERVICE } from 'src/config/services';

@Controller('users/me/stats')
export class UserStatsController {
  constructor(
    @Inject(USERS_SERVICE) private readonly userStatsClient: ClientProxy,
  ) {}

  // GET /api/users/me/stats/:sqlUserId
  @Get(':sqlUserId')
  findOne(@Param('sqlUserId') sqlUserId: string) {
    return this.userStatsClient.send('findUserStats', sqlUserId);
  }

  // POST /api/users/me/stats/:sqlUserId/view
  @Post(':sqlUserId/view')
  incrementProfileViews(@Param('sqlUserId') sqlUserId: string) {
    return this.userStatsClient.send('incrementProfileViews', sqlUserId);
  }
}