import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { USERS_SERVICE } from '../../../config/services.js';
import { CreateSMDto, UpdateSMDto } from '../../dto/index.js';
import { handleRpcCustomError } from '../../../common/index.js';

@Controller('social-media')
export class SocialMediaController {
  constructor(
    @Inject(USERS_SERVICE) private readonly socialMediaClient: ClientProxy,
  ) {}

  @Post()
  create(@Body() createSMDto: CreateSMDto) {
    return this.socialMediaClient
      .send('createSocialMedia', createSMDto || {})
      .pipe(catchError(handleRpcCustomError));
  }

  // GET /social-media?userId=<uuid>  → redes sociales de un usuario (query param)
  // GET /social-media                → todas las redes sociales
  @Get()
  findAll(@Query('userId') userId?: string) {
    if (userId) {
      return this.socialMediaClient
        .send('findSocialMediaByUserId', { userId })
        .pipe(catchError(handleRpcCustomError));
    }
    return this.socialMediaClient
      .send('findAllSocialMedia', {})
      .pipe(catchError(handleRpcCustomError));
  }

  // GET /social-media/user/:userId  → redes sociales de un usuario (path param)
  @Get('user/:userId')
  findByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.socialMediaClient
      .send('findSocialMediaByUserId', { userId })
      .pipe(catchError(handleRpcCustomError));
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.socialMediaClient
      .send('findOneSocialMedia', id)
      .pipe(catchError(handleRpcCustomError));
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSMDto: UpdateSMDto,
  ) {
    return this.socialMediaClient
      .send('updateSocialMedia', { id, ...updateSMDto })
      .pipe(catchError(handleRpcCustomError));
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.socialMediaClient
      .send('removeSocialMedia', id)
      .pipe(catchError(handleRpcCustomError));
  }
}
