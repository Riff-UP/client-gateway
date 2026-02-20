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
import { USERS_SERVICE } from 'src/config/services';
import { CreatePRDto, MailDto } from 'src/users/dto';

@Controller('auth/password/reset')
export class PasswordResetsController {
  constructor(
    @Inject(USERS_SERVICE) private readonly passwordResetsClient: ClientProxy,
  ) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  sendPasswordReset(@Body() mailDto: MailDto) {
    return this.passwordResetsClient.send('psswrdResetSender', mailDto);
  }

  @Post()
  create(@Body() createPRDto: CreatePRDto) {
    return this.passwordResetsClient.send(
      'createPasswordReset',
      createPRDto || {},
    );
  }

  @Get()
  findAll() {
    return this.passwordResetsClient.send('findAllPasswordResets', {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.passwordResetsClient.send('findOnePasswordReset', id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() CreatePRDto: CreatePRDto) {
    return this.passwordResetsClient.send('updatePasswordReset', {
      id,
      ...CreatePRDto,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.passwordResetsClient.send('removePasswordReset', id);
  }
}
