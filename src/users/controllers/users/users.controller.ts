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
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USERS_SERVICE } from '../../../config/services.js';
import { CreateUserDto, UpdateUserDto } from '../../dto/index.js';
import { handleRpcCustomError } from '../../../common/index.js';
import { catchError } from 'rxjs';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard.js';
import { GetUser } from '../../../auth/decorators/get-user.decorator.js';

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

  // GET /users/me → datos del usuario autenticado desde el JWT
  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMe(@GetUser() user: any) {
    return this.usersClient
      .send('findOneUser', user.id)
      .pipe(catchError(handleRpcCustomError));
  }

  // GET /users?query=<search> → búsqueda de usuarios por nombre/email
  @Get()
  findAll(@Query('query') query?: string) {
    if (query) {
      return this.usersClient
        .send('searchUsers', { query })
        .pipe(catchError(handleRpcCustomError));
    }
    return this.usersClient
      .send('findAllUsers', {})
      .pipe(catchError(handleRpcCustomError));
  }


  // GET /users/artists?limit=&offset= → listar usuarios con rol ARTIST
  @Get('artists')
  findArtists(@Query() pagination: any) {
    return this.usersClient
      .send('findArtists', pagination)
      .pipe(catchError(handleRpcCustomError));
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersClient
      .send('findOneUser', id)
      .pipe(catchError(handleRpcCustomError));
  }

  // PATCH /users/me → actualizar el perfil del usuario autenticado
  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateMe(@GetUser() user: any, @Body() updateUserDto: UpdateUserDto) {
    return this.usersClient
      .send('updateUser', { id: user.id, ...updateUserDto })
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
      .send('deactivateUser', id)
      .pipe(catchError(handleRpcCustomError));
  }

  //testing
  @Delete(':id/hard')
  hardRemove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersClient
      .send('removeUser', id)
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
