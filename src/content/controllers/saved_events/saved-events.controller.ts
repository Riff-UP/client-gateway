import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CONTENT_SERVICE } from '../../../config/services.js';
import { CreateSavedEventDto } from '../../dto';
import { handleRpcCustomError } from '../../../common/index.js';
import { catchError } from 'rxjs';

@Controller('events/saved')
export class SavedEventsController {
  constructor(
    @Inject(CONTENT_SERVICE) private readonly savedEventsService: ClientProxy,
  ) {}

  @Post()
  create(@Body() createSavedEventDto: CreateSavedEventDto) {
    return this.savedEventsService
      .send('createSavedEvent', createSavedEventDto || {})
      .pipe(catchError(handleRpcCustomError));
  }

  // GET /events/saved?userId=<userId> → eventos guardados de un usuario
  @Get()
  findAll(@Query('userId') userId?: string) {
    return this.savedEventsService
      .send('findAllSavedEvents', userId ? { userId } : {})
      .pipe(catchError(handleRpcCustomError));
  }

  // GET /events/saved/user/:userId → eventos guardados de un usuario (ruta explícita)
  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.savedEventsService
      .send('findSavedEventsByUser', { userId })
      .pipe(catchError(handleRpcCustomError));
  }

  // GET /events/saved/:id → un evento guardado por su ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.savedEventsService
      .send('findOneSavedEvent', { id })
      .pipe(catchError(handleRpcCustomError));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.savedEventsService
      .send('removeSavedEvent', id)
      .pipe(catchError(handleRpcCustomError));
  }
}

