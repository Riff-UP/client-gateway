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
  HttpException,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USERS_SERVICE } from '../../../config/services.js';
import { CreateUserDto, UpdateUserDto } from '../../dto/index.js';
import { handleRpcCustomError } from '../../../common/index.js';
import { catchError, map, throwError, TimeoutError, timeout } from 'rxjs';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../../auth/guards/roles.guard.js';
import { GetUser } from '../../../auth/decorators/get-user.decorator.js';
import { Roles } from '../../../auth/decorators/roles.decorator.js';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(USERS_SERVICE) private readonly usersClient: ClientProxy,
  ) {}

  private extractStatusCode(error: unknown): number | undefined {
    const candidate = error as
      | { statusCode?: number; error?: { statusCode?: number }; response?: { statusCode?: number } }
      | undefined;
    if (typeof candidate?.statusCode === 'number') return candidate.statusCode;
    if (typeof candidate?.error?.statusCode === 'number') return candidate.error.statusCode;
    if (typeof candidate?.response?.statusCode === 'number') return candidate.response.statusCode;
    return undefined;
  }

  private extractMessage(error: unknown): string {
    const candidate = error as
      | { message?: string | string[]; error?: { message?: string | string[] }; response?: { message?: string | string[] } }
      | undefined;
    const message = candidate?.message ?? candidate?.error?.message ?? candidate?.response?.message;
    if (Array.isArray(message)) return message.join(', ');
    if (typeof message === 'string' && message.trim()) return message;
    return 'Internal Server Error from Microservice';
  }

  private mapFollowersTotalError(error: unknown): HttpException {
    if (error instanceof TimeoutError) {
      return new HttpException(
        { statusCode: HttpStatus.GATEWAY_TIMEOUT, message: 'Gateway timeout while fetching followers total', error: 'GATEWAY_TIMEOUT' },
        HttpStatus.GATEWAY_TIMEOUT,
      );
    }
    const statusCode = this.extractStatusCode(error);
    const message = this.extractMessage(error);
    if (statusCode === HttpStatus.NOT_FOUND) {
      return new HttpException({ statusCode: HttpStatus.NOT_FOUND, message, error: 'NOT_FOUND' }, HttpStatus.NOT_FOUND);
    }
    if (statusCode === HttpStatus.BAD_REQUEST) {
      return new HttpException({ statusCode: HttpStatus.BAD_REQUEST, message, error: 'BAD_REQUEST' }, HttpStatus.BAD_REQUEST);
    }
    try { handleRpcCustomError(error); } catch (mapped) { if (mapped instanceof HttpException) return mapped; }
    return new HttpException({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message }, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  // ── PÚBLICO

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersClient
      .send('createUser', createUserDto || {})
      .pipe(catchError(handleRpcCustomError));
  }

  @Get('artists')
  findArtists(@Query() pagination: any) {
    return this.usersClient
      .send('findArtists', pagination)
      .pipe(catchError(handleRpcCustomError));
  }

  // ── AUTENTICADO
  // IMPORTANTE: /me debe ir ANTES de /:id para no ser capturado como UUID param

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMe(@GetUser() user: any) {
    return this.usersClient
      .send('findOneUser', user.id)
      .pipe(catchError(handleRpcCustomError));
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateMe(@GetUser() user: any, @Body() updateUserDto: UpdateUserDto) {
    return this.usersClient
      .send('updateUser', { id: user.id, ...updateUserDto })
      .pipe(catchError(handleRpcCustomError));
  }

  @Patch('me/password')
  @UseGuards(JwtAuthGuard)
  changeMyPassword(@GetUser() user: any, @Body() body: { newPassword: string }) {
    return this.usersClient
      .send('addPassword', { id: user.id, newPassword: body.newPassword })
      .pipe(catchError(handleRpcCustomError));
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  removeMe(@GetUser() user: any) {
    return this.usersClient
      .send('deactivateUser', user.id)
      .pipe(catchError(handleRpcCustomError));
  }

  // ── PÚBLICO con param

  @Get(':userId/followers/total')
  findFollowersTotal(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.usersClient.send('findFollowersTotalByUser', { userId }).pipe(
      timeout(5000),
      map((response: { userId?: string; totalFollowers?: number }) => ({
        userId: response?.userId ?? userId,
        totalFollowers: response?.totalFollowers,
      })),
      catchError((error: unknown) => throwError(() => this.mapFollowersTotalError(error))),
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersClient
      .send('findOneUser', id)
      .pipe(catchError(handleRpcCustomError));
  }

  // ── SOLO ADMIN

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
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

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersClient
      .send('updateUser', { id, ...updateUserDto })
      .pipe(catchError(handleRpcCustomError));
  }

  @Patch(':id/password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  addPassword(@Param('id', ParseUUIDPipe) id: string, @Body() body: { newPassword: string }) {
    return this.usersClient
      .send('addPassword', { id, newPassword: body.newPassword })
      .pipe(catchError(handleRpcCustomError));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: any) {
    const requesterId = String(user?.id ?? '');
    const requesterRole = String(user?.role ?? '');
    const isAdmin = requesterRole.toUpperCase() === 'ADMIN';

    if (!isAdmin && requesterId !== id) {
      throw new ForbiddenException('No tienes permisos suficientes');
    }

    return this.usersClient
      .send('deactivateUser', id)
      .pipe(catchError(handleRpcCustomError));
  }

  @Delete(':id/hard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  hardRemove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersClient
      .send('removeUser', id)
      .pipe(catchError(handleRpcCustomError));
  }
}