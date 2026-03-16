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
import { CreatePRDto, MailDto, ResetPasswordDto } from '../../dto/index.js';
import { handleRpcCustomError } from '../../../common/index.js';
import { catchError, firstValueFrom } from 'rxjs';

interface ResetResult {
  message?: string;
  userId?: string;
  id?: string;
  userName?: string;
  name?: string;
  token?: string;
}

interface UserLookupResult {
  id?: string;
  userId?: string;
  email?: string;
}

interface CreateNotificationPayload {
  userIdReceiver: string;
  type: 'NEW_EVENT';
  message: string;
}

@Controller('password-resets')
export class PasswordResetsController {
  constructor(
    @Inject(USERS_SERVICE) private readonly passwordResetsClient: ClientProxy,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsClient: ClientProxy,
  ) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  async sendPasswordReset(@Body() mailDto: MailDto) {
    // Obtener usuario por email para asegurar userId para notifications-ms.
    const user = (await firstValueFrom(
      this.passwordResetsClient
        .send('findUserByEmail', { email: mailDto.mail })
        .pipe(catchError(handleRpcCustomError)),
    )) as UserLookupResult;

    // Crear el reset en Users-MS y obtener token/datos
    const result = (await firstValueFrom(
      this.passwordResetsClient
        .send('sendPasswordReset', mailDto)
        .pipe(catchError(handleRpcCustomError)),
    )) as ResetResult;

    const userIdReceiver = result.userId ?? result.id ?? user.id ?? user.userId;
    if (userIdReceiver) {
      const notificationPayload: CreateNotificationPayload = {
        userIdReceiver,
        type: 'NEW_EVENT',
        message: 'Se solicito un restablecimiento de contrasena.',
      };

      // No bloquear el flujo de reset si notifications-ms no responde.
      this.notificationsClient
        .send('createNotification', notificationPayload)
        .pipe(catchError(handleRpcCustomError))
        .subscribe({
          next: () => {
            console.log('[PasswordReset] Notificacion enviada a notifications-ms', {
              userIdReceiver,
              mail: mailDto.mail,
            });
          },
          error: (error: unknown) => {
            console.error(
              '[PasswordReset] Error al enviar notificacion a notifications-ms',
              {
                userIdReceiver,
                mail: mailDto.mail,
                error,
              },
            );
          },
        });
    } else {
      console.warn('[PasswordReset] Users-MS no devolvio userId/id, se omite notificacion', {
        mail: mailDto.mail,
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

  @Patch('reset')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.passwordResetsClient
      .send('updatePasswordReset', resetPasswordDto)
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
