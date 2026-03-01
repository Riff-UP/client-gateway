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
import { CONTENT_SERVICE } from '../../../config/services.js';
import { CreateEventAttendanceDto } from '../../dto';
import { catchError } from 'rxjs';
import { handleRpcCustomError } from '../../../common/index.js';

@Controller('events/attendance')
export class EventAttendanceController {
  constructor(
    @Inject(CONTENT_SERVICE)
    private readonly eventAttendanceService: ClientProxy,
  ) {}

  @Post()
  create(@Body() createEventAttendanceDto: CreateEventAttendanceDto) {
    return this.eventAttendanceService
      .send('createEventAttendance', createEventAttendanceDto || {})
      .pipe(catchError(handleRpcCustomError));
  }

  @Get()
  findAll() {
    return this.eventAttendanceService
      .send('findAllEventAttendances', {})
      .pipe(catchError(handleRpcCustomError));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventAttendanceService
      .send('removeEventAttendance', id)
      .pipe(catchError(handleRpcCustomError));
  }
}
