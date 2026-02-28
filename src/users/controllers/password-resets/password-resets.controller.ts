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

@Controller('auth/password/reset')
export class PasswordResetsController {
  constructor(
    @Inject(USERS_SERVICE) private readonly passwordResetsClient: ClientProxy,
  ) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  sendPasswordReset(@Body() mailDto: MailDto) {
    return this.passwordResetsClient.send('sendPasswordReset', mailDto).pipe(
      handleRpcCustomError()
    );
  }

  @Post()
  create(@Body() createPRDto: CreatePRDto) {
    return this.passwordResetsClient.send('createPasswordReset', createPRDto).pipe(
      handleRpcCustomError()
    );
  }

  @Get()
  findAll() {
    return this.passwordResetsClient.send('findAllPasswordResets', {}).pipe(
      handleRpcCustomError()
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.passwordResetsClient.send('findOnePasswordReset', id).pipe(
      handleRpcCustomError()
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() createPRDto: CreatePRDto) {
    return this.passwordResetsClient.send('updatePasswordReset', {
      id,
      ...createPRDto,
    }).pipe(
      handleRpcCustomError()
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.passwordResetsClient.send('removePasswordReset', id).pipe(
      handleRpcCustomError()
    );
  }
}