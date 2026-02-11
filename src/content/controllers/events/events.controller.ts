import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CONTENT_SERVICE } from 'src/config/services';
import { CreateEventDto } from '../../dto';

@Controller('events')
    export class EventsController {
        constructor(
            @Inject(CONTENT_SERVICE) private readonly eventService: ClientProxy
        ){}
        @Post()
        create(@Body() createEventDto: CreateEventDto){
            return this.eventService.send('createEvent', createEventDto || {});
        }

        @Get()
        findAll(){
            return this.eventService.send('findAllEvents', {});
        }
        
        @Get(':id')
        findOne(@Param('id') id: string){
            return this.eventService.send('findOneEvent', id);
        }

        @Patch(':id')
        update(@Param('id') id: string, @Body() updateEventDto: CreateEventDto){
            return this.eventService.send('updateEvent', {id, ...updateEventDto});
        }

        @Delete(':id')
        remove(@Param('id') id: string){
            return this.eventService.send('removeEvent', id);
        }
}