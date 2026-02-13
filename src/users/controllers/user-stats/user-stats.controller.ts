import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USERS_SERVICE } from 'src/config/services';
import { CreateUSDto } from 'src/users/dto';

@Controller('users/me/stats')
export class UserStatsController {
    constructor(
        @Inject(USERS_SERVICE) private readonly userStatsClient: ClientProxy,
    ){}

    @Post()
    create(@Body() createUSDto: CreateUSDto) {
        return this.userStatsClient.send('createUserStat', createUSDto || {});
    }

    @Get()
    findAll(){
        return this.userStatsClient.send('findAllUserStats', {});
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userStatsClient.send('findOneUserStat', id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() CreateUSDto: CreateUSDto) {
        return this.userStatsClient.send('updateUserStat', {
            id, ...CreateUSDto,
        });
    }

    @Delete(':id')
    remove(@Param('id') id:string) {
        return this.userStatsClient.send('removeUserStat', id);
    }
}