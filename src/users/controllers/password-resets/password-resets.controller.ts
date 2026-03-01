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
import {
  USERS_SERVICE,
  NOTIFICATIONS_SERVICE,
} from '../../../config/services.js';
import { CreatePRDto, MailDto } from '../../dto/index.js';
import { handleRpcCustomError } from '../../../common/index.js';
import { catchError, firstValueFrom } from 'rxjs';

interface ResetResult {
  userId?: string;
  id?: string;
  userName?: string;
  name?: string;
  token?: string;
}

@Controller('password-resets')
export class PasswordResetsController {
  constructor(
    @Inject(USERS_SERVICE) private readonly passwordResetsClient: ClientProxy,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsClient: ClientProxy,
  ) { }

  @Post('send')
  @HttpCode(HttpStatus.OK)
  async sendPasswordReset(@Body() mailDto: MailDto) {
    // Crear el reset en Users-MS y obtener token/datos
    const result = (await firstValueFrom(
      this.passwordResetsClient
        .send('sendPasswordReset', mailDto)
        .pipe(catchError(handleRpcCustomError)),
    )) as ResetResult;

    // Emitir evento para que Notifications-MS envíe el email
    if (result) {
      this.notificationsClient.emit('send.resetPassword', {
        mail: mailDto.mail,
        userId: result.userId ?? result.id,
        userName: result.userName ?? result.name,
        token: result.token,
      });
    }

    return result;
  }

  @Post()
  create(@Body() createPRDto: CreatePRDto) {
    return this.passwordResetsClient
      .send('createPasswordReset', createPRDto)
      .pipe(catchError(handleRpcCustomError));
  }

  @Get()
  findAll() {
    return this.passwordResetsClient
      .send('findAllPasswordResets', {})
      .pipe(catchError(handleRpcCustomError));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.passwordResetsClient
      .send('findOnePasswordReset', id)
      .pipe(catchError(handleRpcCustomError));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() createPRDto: CreatePRDto) {
    return this.passwordResetsClient
      .send('updatePasswordReset', {
        id,
        ...createPRDto,
      })
      .pipe(catchError(handleRpcCustomError));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.passwordResetsClient
      .send('removePasswordReset', id)
      .pipe(catchError(handleRpcCustomError));
  }
}
