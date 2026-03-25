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
  BadRequestException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CONTENT_SERVICE, USERS_SERVICE } from '../../../config/services';
import { CreateEventDto, UpdateEventDto } from '../../dto';
import { catchError, firstValueFrom, map } from 'rxjs';
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
    console.log('👤 User from JWT Guard:', JSON.stringify(user));

    // Validar que el usuario existe
    if (!user || !user.id) {
      console.error('user.id is undefined! User object:', user);
      throw new BadRequestException(
        'Usuario no autenticado. El token JWT no contiene un userId válido.',
      );
    }

    // El userId viene del JWT, no del body
    const userId = user.id;
    console.log('userId extraído del JWT:', userId);

    const followers = await firstValueFrom(
      this.usersService.send('findFollowers', {
        userId: userId,
      }),
    ).catch((error) => {
      console.warn(
        'No se pudieron obtener followers, continuando sin ellos. Error:',
        error.message,
      );
      return [];
    });

    console.log('📤 Enviando al microservicio:', {
      ...createEventDto,
      sql_user_id: userId,
      followers,
    });

    return this.eventService
      .send('createEvent', {
        ...createEventDto,
        sql_user_id: userId, // ← Añadir el userId del JWT
        followers,
      })
      .pipe(catchError(handleRpcCustomError));
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('userId') userId?: string,
    @Query('organizerId') organizerId?: string,
  ) {
    if (organizerId) {
      return this.eventService
        .send('findEventsByOrganizer', { organizerId })
        .pipe(catchError(handleRpcCustomError));
    }

    const payload = userId
      ? { ...paginationDto, userId }
      : { ...paginationDto };

    return this.eventService
      .send('findAllEvents', payload)
      .pipe(catchError(handleRpcCustomError));
  }

  @Get(':eventId/attendance/total')
  findAttendanceTotal(@Param('eventId') eventId: string) {
    return this.eventService
      .send('getEventAttendanceTotal', { eventId })
      .pipe(
        map((response: { eventId?: string; totalAttendees?: number }) => ({
          eventId: response?.eventId ?? eventId,
          totalAttendees: response?.totalAttendees ?? 0,
        })),
        catchError(handleRpcCustomError),
      );
  }

  @Get(':eventId/rating/average')
  findRatingAverage(@Param('eventId') eventId: string) {
    return this.eventService
      .send('getEventRatingAverage', { eventId })
      .pipe(
        map(
          (response: {
            eventId?: string;
            averageRating?: number;
            totalRatings?: number;
          }) => ({
            eventId: response?.eventId ?? eventId,
            averageRating: response?.averageRating ?? 0,
            totalRatings: response?.totalRatings ?? 0,
          }),
        ),
        catchError(handleRpcCustomError),
      );
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
