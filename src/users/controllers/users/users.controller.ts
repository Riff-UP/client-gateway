import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseUUIDPipe } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USERS_SERVICE } from '../../../config/services.js';
import { CreateUserDto, UpdateUserDto } from '../../dto/index.js';
import { handleRpcCustomError } from '../../../common/index.js';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(USERS_SERVICE) private readonly usersClient : ClientProxy
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersClient.send('createUser', createUserDto || {}).pipe(
      handleRpcCustomError()
    )
  }

  @Get()
  findAll() {
    return this.usersClient.send('findAllUsers', {}).pipe(
      handleRpcCustomError()
    )
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersClient.send('findOneUser', id).pipe(
      handleRpcCustomError()
    )
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersClient.send('updateUser', {id, ...updateUserDto}).pipe(
      handleRpcCustomError()
    )
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersClient.send('removeUser', id).pipe(
      handleRpcCustomError()
    )
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id', ParseUUIDPipe) id: string){
    return this.usersClient.send('deactivateUser', id).pipe(
      handleRpcCustomError()
    )
  }

  @Patch(':id/password')
  addPassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body : {newPassword: string}
  ){
    return this.usersClient.send('addPassword', {id, newPassword: body.newPassword}).pipe(
      handleRpcCustomError()
    )
  }
}
