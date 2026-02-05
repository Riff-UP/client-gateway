import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USERS_SERVICE } from '../config/services.js';
import { CreateUserDto, UpdateUserDto } from './dto/index.js';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(USERS_SERVICE) private readonly usersClient : ClientProxy
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersClient.send('createUser', createUserDto || {})
  }

  @Get()
  findAll() {
    return this.usersClient.send('findAllUsers', {})
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersClient.send('findOneUser', id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersClient.send('updateUser', {id, ...updateUserDto});
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersClient.send('removeUser', id);
  }
}
