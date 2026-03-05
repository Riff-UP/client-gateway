import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CONTENT_SERVICE } from '../../../config/services.js';
import { CreateEventAttendanceDto } from '../../dto';
import { catchError } from 'rxjs';
import { handleRpcCustomError } from '../../../common/index.js';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../../auth/decorators/get-user.decorator';

@Controller('events/attendance')
export class EventAttendanceController {
  constructor(
    @Inject(CONTENT_SERVICE)
    private readonly eventAttendanceService: ClientProxy,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@GetUser() user: any, @Body() createEventAttendanceDto: CreateEventAttendanceDto) {
    const payload = {
      ...createEventAttendanceDto,
      userId: user.id, // ← Solo userId (UUID de MongoDB)
    };
    return this.eventAttendanceService
      .send('createEventAttendance', payload)
      .pipe(catchError(handleRpcCustomError));
  }

  @Get('event/:eventId')
  findByEvent(@Param('eventId') eventId: string) {
    return this.eventAttendanceService
      .send('findAttendanceByEvent', { event_id: eventId })
      .pipe(catchError(handleRpcCustomError));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventAttendanceService
      .send('findOneEventAttendance', { id })
      .pipe(catchError(handleRpcCustomError));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttendanceDto: Partial<CreateEventAttendanceDto>,
  ) {
    return this.eventAttendanceService
      .send('updateEventAttendance', { id, ...updateAttendanceDto })
      .pipe(catchError(handleRpcCustomError));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@GetUser() user: any, @Param('id') id: string) {
    return this.eventAttendanceService
      .send('removeEventAttendance', { id, userId: user.id })
      .pipe(catchError(handleRpcCustomError));
  }
}
