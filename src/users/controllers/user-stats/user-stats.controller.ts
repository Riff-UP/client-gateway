import { Controller, Get, Inject, Param, Patch } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USERS_SERVICE } from '../../../config/services.js';

@Controller('user-stats')
export class UserStatsController {
  constructor(
    @Inject(USERS_SERVICE) private readonly userStatsClient: ClientProxy,
  ) {}

  // GET /user-stats/:sqlUserId
  @Get(':sqlUserId')
  findOne(@Param('sqlUserId') sqlUserId: string) {
    return this.userStatsClient.send('findUserStats', sqlUserId);
  }

  // PATCH /user-stats/:sqlUserId/views
  @Patch(':sqlUserId/views')
  incrementProfileViews(@Param('sqlUserId') sqlUserId: string) {
    return this.userStatsClient.send('incrementProfileViews', sqlUserId);
  }
}
