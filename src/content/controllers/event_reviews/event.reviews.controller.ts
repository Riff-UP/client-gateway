import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CONTENT_SERVICE } from '../../../config/services';
import { CreateEventReviewsDto, UpdateEventReviewsDto } from '../../dto';
import { handleRpcCustomError } from '../../../common';
import { catchError } from 'rxjs';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../../auth/decorators/get-user.decorator';

@Controller('events/reviews')
export class EventReviewsController {
  constructor(
    @Inject(CONTENT_SERVICE) private readonly eventReviewsService: ClientProxy,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@GetUser() user: any, @Body() createEventReviewDto: CreateEventReviewsDto) {
    const payload = {
      ...createEventReviewDto,
      userId: user.id, // ← Solo userId (UUID de MongoDB)
    };
    return this.eventReviewsService
      .send('createEventReview', payload)
      .pipe(catchError(handleRpcCustomError));
  }

  // GET /events/reviews?userId=<userId>   → reseñas hechas por un usuario
  // GET /events/reviews?eventId=<eventId> → reseñas de un evento específico
  @Get()
  findAll(
    @Query('userId') userId?: string,
    @Query('eventId') eventId?: string,
  ) {
    if (userId) {
      return this.eventReviewsService
        .send('findReviewsByUser', { userId })
        .pipe(catchError(handleRpcCustomError));
    }
    if (eventId) {
      return this.eventReviewsService
        .send('findReviewsByEvent', { event_id: eventId })
        .pipe(catchError(handleRpcCustomError));
    }
    return this.eventReviewsService
      .send('findAllEventReviews', {})
      .pipe(catchError(handleRpcCustomError));
  }

  @Get('event/:eventId')
  findByEvent(@Param('eventId') eventId: string) {
    return this.eventReviewsService
      .send('findReviewsByEvent', { event_id: eventId })
      .pipe(catchError(handleRpcCustomError));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventReviewsService
      .send('findOneEventReview', { id })
      .pipe(catchError(handleRpcCustomError));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEventReviewDto: UpdateEventReviewsDto,
  ) {
    return this.eventReviewsService
      .send('updateEventReview', { id, ...updateEventReviewDto })
      .pipe(catchError(handleRpcCustomError));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@GetUser() user: any, @Param('id') id: string) {
    return this.eventReviewsService
      .send('removeEventReview', { id, userId: user.id })
      .pipe(catchError(handleRpcCustomError));
  }
}
