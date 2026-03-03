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
  UseGuards,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USERS_SERVICE } from '../../../config/services.js';
import { CreateUserDto, UpdateUserDto } from '../../dto/index.js';
import { handleRpcCustomError, CurrentUser } from '../../../common/index.js';
import { catchError } from 'rxjs';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard.js';

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

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser('id') userId: string) {
    return this.usersClient.send('findOneUser', userId)
    .pipe(catchError(handleRpcCustomError))
  }

  @Get('artists')
  findAllArtists(@Query('search') search?: string) {
    return this.usersClient
    .send('findAllArtists', { search })
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
    return this.usersClient.send('deactivateUser', id).pipe(
      catchError(handleRpcCustomError)
    )
  }

  //testing
  @Delete(':id/hard')
  hardRemove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersClient.send('removeUser', id).pipe(
      catchError(handleRpcCustomError)
    )
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
