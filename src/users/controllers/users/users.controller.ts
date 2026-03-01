import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USERS_SERVICE } from '../../../config/services.js';
import { CreateUserDto, UpdateUserDto } from '../../dto/index.js';
import { handleRpcCustomError } from '../../../common/index.js';
import { catchError } from 'rxjs';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(USERS_SERVICE) private readonly usersClient: ClientProxy,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersClient
      .send('createUser', createUserDto || {})
      .pipe(catchError(handleRpcCustomError));
  }

  @Get()
  findAll() {
    return this.usersClient
      .send('findAllUsers', {})
      .pipe(catchError(handleRpcCustomError));
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersClient
      .send('findOneUser', id)
      .pipe(catchError(handleRpcCustomError));
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersClient
      .send('updateUser', { id, ...updateUserDto })
      .pipe(catchError(handleRpcCustomError));
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersClient
      .send('removeUser', id)
      .pipe(catchError(handleRpcCustomError));
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersClient
      .send('deactivateUser', id)
      .pipe(catchError(handleRpcCustomError));
  }

  @Patch(':id/password')
  addPassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { newPassword: string },
  ) {
    return this.usersClient
      .send('addPassword', { id, newPassword: body.newPassword })
      .pipe(catchError(handleRpcCustomError));
  }
}
