import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USERS_SERVICE } from 'src/config/services';
import { CreateSMDto } from 'src/users/dto';

@Controller('sm')
export class SocialMediaController {
  constructor(
    @Inject(USERS_SERVICE) private readonly socialMediaClient: ClientProxy,
  ) {}

  @Post()
  create(@Body() createSMDto: CreateSMDto) {
    return this.socialMediaClient.send('createSocialMedia', createSMDto || {});
  }

  @Get()
  findAll() {
    return this.socialMediaClient.send('findAllSocialMedia', {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.socialMediaClient.send('findOneSocialMedia', id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() CreateSMDto: CreateSMDto) {
    return this.socialMediaClient.send('updateSocialMedia', {
      id,
      ...CreateSMDto,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.socialMediaClient.send('removeSocialMedia', id);
  }
}
