import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CONTENT_SERVICE } from '../../../config/services';
import { CreateEventReviewsDto } from '../../dto';
import { handleRpcCustomError } from '../../../common';
import { catchError } from 'rxjs';

@Controller('events/reviews')
export class EventReviewsController {
  constructor(
    @Inject(CONTENT_SERVICE) private readonly eventReviewsService: ClientProxy,
  ) {}

  @Post()
  create(@Body() createEventReviewDto: CreateEventReviewsDto) {
    return this.eventReviewsService.send(
      'createEventReview',
      createEventReviewDto || {},
    ).pipe(
      catchError(handleRpcCustomError)
    )
  }

  @Get()
  findAll() {
    return this.eventReviewsService.send('findAllEventReviews', {}).pipe(
      catchError(handleRpcCustomError)
    )
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventReviewsService.send('findOneEventReview', id).pipe(
      catchError(handleRpcCustomError)
    )
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventReviewsService.send('removeEventReview', id).pipe(
      catchError(handleRpcCustomError)
    )
  }
}
