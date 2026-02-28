import { Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USERS_SERVICE } from '../../../config/services.js';
import { handleRpcCustomError } from '../../../common/index.js';

@Controller('users/me/stats')
export class UserStatsController {
  constructor(
    @Inject(USERS_SERVICE) private readonly userStatsClient: ClientProxy,
  ) {}

  // GET /api/users/me/stats/:sqlUserId
  @Get(':sqlUserId')
  findOne(@Param('sqlUserId') sqlUserId: string) {
    return this.userStatsClient.send('findUserStats', sqlUserId).pipe(
      handleRpcCustomError()
    )
  }

  // POST /api/users/me/stats/:sqlUserId/view
  @Post(':sqlUserId/view')
  incrementProfileViews(@Param('sqlUserId') sqlUserId: string) {
    return this.userStatsClient.send('incrementProfileViews', sqlUserId).pipe(
      handleRpcCustomError()
    )
  }
}
