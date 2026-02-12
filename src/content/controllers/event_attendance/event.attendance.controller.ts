import { Body, Controller, Delete, Get, Inject, Param, Patch, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CONTENT_SERVICE } from "src/config/services";
import { CreateEventAttendanceDto } from "../../dto";

@Controller('events/attendance')
export class EventAttendanceController{
    constructor(
        @Inject(CONTENT_SERVICE) private readonly eventAttendanceService: ClientProxy
    ) {}

    @Post()
    create(@Body() createEventAttendanceDto: CreateEventAttendanceDto) {
        return this.eventAttendanceService.send('createEventAttendance', createEventAttendanceDto || {});
    }

    @Get()
    findAll(){
        return this.eventAttendanceService.send('findAllEventAttendances', {});
    }

    @Delete(':id')
    remove(@Param('id') id: string){
        return this.eventAttendanceService.send('removeEventAttendance', id);
    }
}