import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { USERS_SERVICE } from 'src/config/services';
import { CreateSMDto, UpdateSMDto } from 'src/users/dto';

function getHttpStatus(err: any, fallback = HttpStatus.INTERNAL_SERVER_ERROR): number {
  const status = Number(err?.status);
  return Number.isInteger(status) && status >= 100 && status < 600 ? status : fallback;
}

@Controller('sm')
export class SocialMediaController {
  constructor(
    @Inject(USERS_SERVICE) private readonly socialMediaClient: ClientProxy,
  ) { }

  @Post()
  create(@Body() createSMDto: CreateSMDto) {
    return this.socialMediaClient.send('createSocialMedia', createSMDto || {});
  }

  @Get()
  findAll() {
    return this.socialMediaClient.send('findAllSocialMedia', {});
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return firstValueFrom(
      this.socialMediaClient.send('findOneSocialMedia', id).pipe(
        catchError((err) => {
          throw new HttpException(
            err.message || `Social media with id ${id} not found`,
            getHttpStatus(err, HttpStatus.NOT_FOUND),
          );
        }),
      ),
    );
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSMDto: UpdateSMDto,
  ) {
    return firstValueFrom(
      this.socialMediaClient
        .send('updateSocialMedia', {
          id,
          ...updateSMDto,
        })
        .pipe(
          catchError((err) => {
            throw new HttpException(
              err.message || `Failed to update social media with id ${id}`,
              getHttpStatus(err),
            );
          }),
        ),
    );
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return firstValueFrom(
      this.socialMediaClient.send('removeSocialMedia', id).pipe(
        catchError((err) => {
          throw new HttpException(
            err.message || `Failed to delete social media with id ${id}`,
            getHttpStatus(err),
          );
        }),
      ),
    );
  }
}
