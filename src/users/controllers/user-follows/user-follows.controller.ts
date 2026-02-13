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
import { CreateUFDto } from 'src/users/dto';

@Controller('follows')
export class UserFollowsController {
    constructor(
        @Inject(USERS_SERVICE) private readonly userFollowsClient: ClientProxy,
    ){}

    @Post()
    create(@Body() createUFDto: CreateUFDto) {
        return this.userFollowsClient.send('createUserFollow', createUFDto || {});
    }

    @Get()
    findAll(){
        return this.userFollowsClient.send('findAllUserFollows', {});
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userFollowsClient.send('findOneUserFollow', id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() CreateUFDto: CreateUFDto) {
        return this.userFollowsClient.send('updateUserFollow', {
            id, ...CreateUFDto,
        });
    }

    @Delete(':id')
    remove(@Param('id') id:string) {
        return this.userFollowsClient.send('removeUserFollow', id);
    }
}