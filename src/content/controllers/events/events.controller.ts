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
import { CONTENT_SERVICE, USERS_SERVICE } from '../../../config/services';
import { CreateEventDto, UpdateEventDto } from '../../dto';
import { catchError, firstValueFrom } from 'rxjs';
import { handleRpcCustomError } from '../../../common/index';

@Controller('events')
export class EventsController {
  constructor(
    @Inject(CONTENT_SERVICE) private readonly eventService: ClientProxy,
    @Inject(USERS_SERVICE) private readonly usersService: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    const followers = await firstValueFrom(
      this.usersService.send('findFollowers', {
        userId: createEventDto.sql_user_id,
      }),
    );

    return this.eventService
      .send('createEvent', {
        ...createEventDto,
        followers,
      })
      .pipe(catchError(handleRpcCustomError));
  }

  @Get()
  findAll() {
    return this.eventService
      .send('findAllEvents', {})
      .pipe(catchError(handleRpcCustomError));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService
      .send('findOneEvent', id)
      .pipe(catchError(handleRpcCustomError));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    let followers: string[] = [];

    if (updateEventDto.sql_user_id) {
      followers = await firstValueFrom(
        this.usersService.send('findFollowers', {
          userId: updateEventDto.sql_user_id,
        }),
      ).catch(() => []);
    }

    return this.eventService
      .send('updateEvent', {
        id,
        ...updateEventDto,
        followers,
      })
      .pipe(catchError(handleRpcCustomError));
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Body() body: { sql_user_id?: string },
  ) {
    let followers = [];

    // Solo buscamos seguidores si se manda el id del usuario
    if (body && body.sql_user_id) {
      followers = await firstValueFrom(
        this.usersService.send('findFollowers', { userId: body.sql_user_id }),
      ).catch(() => []);
    }

    return this.eventService
      .send('removeEvent', { id, followers })
      .pipe(catchError(handleRpcCustomError));
  }
}
