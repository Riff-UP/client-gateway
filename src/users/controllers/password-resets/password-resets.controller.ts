import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USERS_SERVICE } from '../../../config/services.js';
import { CreatePRDto, MailDto } from '../../dto/index.js';
import { handleRpcCustomError } from '../../../common/index.js';
import { catchError } from 'rxjs';

@Controller('password-resets')
export class PasswordResetsController {
  constructor(
    @Inject(USERS_SERVICE) private readonly passwordResetsClient: ClientProxy,
  ) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  sendPasswordReset(@Body() mailDto: MailDto) {
    return this.passwordResetsClient.send('sendPasswordReset', mailDto).pipe(
      catchError(handleRpcCustomError)
    );
  }

  @Post()
  create(@Body() createPRDto: CreatePRDto) {
    return this.passwordResetsClient.send('createPasswordReset', createPRDto).pipe(
      catchError(handleRpcCustomError)
    );
  }

  @Get()
  findAll() {
    return this.passwordResetsClient.send('findAllPasswordResets', {}).pipe(
      catchError(handleRpcCustomError)
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.passwordResetsClient.send('findOnePasswordReset', id).pipe(
      catchError(handleRpcCustomError)
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() createPRDto: CreatePRDto) {
    return this.passwordResetsClient.send('updatePasswordReset', {
      id,
      ...createPRDto,
    }).pipe(
      catchError(handleRpcCustomError)
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.passwordResetsClient.send('removePasswordReset', id).pipe(
      catchError(handleRpcCustomError)
    );
  }
}