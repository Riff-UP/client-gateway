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
    return this.socialMediaClient.send('createSocialMedia', createSMDto || {}).pipe(
      handleRpcCustomError()
    )
  }

  @Get()
  findAll() {
    return this.socialMediaClient.send('findAllSocialMedia', {}).pipe(
      handleRpcCustomError()
    )
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.socialMediaClient.send('findOneSocialMedia', id).pipe(
      handleRpcCustomError()
    )
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSMDto: UpdateSMDto,
  ) {
    return this.socialMediaClient.send('updateSocialMedia', {id, ...updateSMDto}).pipe(
      handleRpcCustomError()
    )
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.socialMediaClient.send('removeSocialMedia', id).pipe(
      handleRpcCustomError()
    )
  }
}
