import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CONTENT_SERVICE, USERS_SERVICE } from '../../../config/services';
import { CreateEventDto, EventPaginationDto, UpdateEventDto } from '../../dto';
import { catchError, firstValueFrom } from 'rxjs';
import { CurrentUser, handleRpcCustomError, PaginationDto } from '../../../common/index';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@Controller('events')
export class EventsController {
  constructor(
    @Inject(CONTENT_SERVICE) private readonly eventService: ClientProxy,
    @Inject(USERS_SERVICE) private readonly usersService: ClientProxy,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createEventDto: CreateEventDto,
    @CurrentUser() user: { id: string; role: string },
  ) {
    const sql_user_id = user.id; // ← ya no viene del body

    const followers = await firstValueFrom(
      this.usersService.send('findFollowers', { userId: sql_user_id }),
    );

    return this.eventService
    .send('createEvent', {
      ...createEventDto,
      sql_user_id,
      followers,
    })
    .pipe(catchError(handleRpcCustomError));
  }

  @Get()
  findAll(@Query() paginationDto: EventPaginationDto) {
    return this.eventService
      .send('findAllEvents', paginationDto)
      .pipe(catchError(handleRpcCustomError));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService
      .send('findOneEvent', {id})
      .pipe(catchError(handleRpcCustomError));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @CurrentUser() user: { id: string; role: string },
  ) {
    const sql_user_id = user.id;

    const followers = await firstValueFrom(
      this.usersService.send('findFollowers', { userId: sql_user_id }),
    ).catch(() => []);

    return this.eventService
    .send('updateEvent', {
      id,
      ...updateEventDto,
      sql_user_id,
      followers,
    })
    .pipe(catchError(handleRpcCustomError));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; role: string },
  ) {
    const followers = await firstValueFrom(
    this.usersService.send('findFollowers', { userId: user.id }),
    ).catch(() => []);

  return this.eventService
    .send('removeEvent', { id, followers })
    .pipe(catchError(handleRpcCustomError));
  }
}
