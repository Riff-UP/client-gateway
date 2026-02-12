import { Body, Controller, Delete, Get, Inject, Param, Patch, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CONTENT_SERVICE } from "src/config/services";
import { CreateEventReviewsDto } from "../../dto";

@Controller('events/reviews')
export class EventReviewsController{
    constructor(
        @Inject(CONTENT_SERVICE) private readonly eventReviewsService: ClientProxy
    ){}

    @Post()
    create(@Body() createEventReviewDto: CreateEventReviewsDto) {
        return this.eventReviewsService.send('createEventReview', createEventReviewDto || {});
    }

    @Get()
    findAll(){
        return this.eventReviewsService.send('findAllEventReviews', {});
    }

    @Get(':id')
    findOne(@Param('id') id: string){
        return this.eventReviewsService.send('findOneEventReview', id);
    }

    @Delete(':id')
    remove(@Param('id') id: string){
        return this.eventReviewsService.send('removeEventReview', id);
    }
}