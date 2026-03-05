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
import { CreateEventDto, UpdateEventDto } from '../../dto';
import { catchError, firstValueFrom } from 'rxjs';
import { handleRpcCustomError, PaginationDto } from '../../../common/index';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../../auth/decorators/get-user.decorator';

@Controller('events')
export class EventsController {
  constructor(
    @Inject(CONTENT_SERVICE) private readonly eventService: ClientProxy,
    @Inject(USERS_SERVICE) private readonly usersService: ClientProxy,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@GetUser() user: any, @Body() createEventDto: CreateEventDto) {
    // El userId viene del JWT, no del body
    const userId = user.id;

    const followers = await firstValueFrom(
      this.usersService.send('findFollowers', {
        userId: userId,
      }),
    );

    return this.eventService
      .send('createEvent', {
        ...createEventDto,
        sql_user_id: userId, // ← Añadir el userId del JWT
        followers,
      })
      .pipe(catchError(handleRpcCustomError));
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto, @Query('userId') userId?: string) {
    // Si hay userId en el query, usarlo; de lo contrario no lo incluye
    const payload = userId
      ? { ...paginationDto, userId }
      : { ...paginationDto };

    return this.eventService
      .send('findAllEvents', payload)
      .pipe(catchError(handleRpcCustomError));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService
      .send('findOneEvent', { id })
      .pipe(catchError(handleRpcCustomError));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    const userId = user.id;

    const followers = await firstValueFrom(
      this.usersService.send('findFollowers', {
        userId: userId,
      }),
    ).catch(() => []);

    return this.eventService
      .send('updateEvent', {
        id,
        ...updateEventDto,
        userId: userId, // ← Solo userId
        followers,
      })
      .pipe(catchError(handleRpcCustomError));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@GetUser() user: any, @Param('id') id: string) {
    const userId = user.id;

    const followers = await firstValueFrom(
      this.usersService.send('findFollowers', { userId: userId }),
    ).catch(() => []);

    return this.eventService
      .send('removeEvent', { id, followers, userId })
      .pipe(catchError(handleRpcCustomError));
  }
}
