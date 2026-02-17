import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseUUIDPipe } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USERS_SERVICE } from '../../../config/services.js';
import { CreateUserDto, UpdateUserDto } from '../../dto/index.js';
import { firstValueFrom } from 'rxjs';

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
  async findOne(@Param('id', ParseUUIDPipe) id: string) {

    try{

      const user = await firstValueFrom(
        this.usersClient.send('findOneUser', id)
      )
      return user

    }catch(error){
      throw new Error(`User with id ${id} not found`)
    }

  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersClient.send('updateUser', {id, ...updateUserDto});
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersClient.send('removeUser', id);
  }
}
