import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CONTENT_SERVICE, USERS_SERVICE } from '../../../config/services.js';
import { CreateEventDto } from '../../dto';
import { firstValueFrom } from 'rxjs';

@Controller('events')
export class EventsController {
  constructor(
    @Inject(CONTENT_SERVICE) private readonly eventService: ClientProxy,
    @Inject(USERS_SERVICE) private readonly usersService: ClientProxy
  ) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    const followers = await firstValueFrom(
      this.usersService.send('findFollowers', {userId: createEventDto.sql_user_id})
    )

    return this.eventService.send('createEvent', {
      ...createEventDto,
      followers
    })
  }

  @Get()
  findAll() {
    return this.eventService.send('findAllEvents', {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.send('findOneEvent', id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEventDto: CreateEventDto) {

    const followers = await firstValueFrom(
      this.usersService.send('findFollowers', {userId: updateEventDto.sql_user_id})
    )

    return this.eventService.send('updateEvent', {
      id,
      ...updateEventDto,
      followers
    })
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Body() body: {sql_user_id: string}) {

    const followers = await firstValueFrom(
      this.usersService.send('findFollowers', {userId: body.sql_user_id})
    )

    return this.eventService.send('removeEvent', {id, followers});
  }
}
