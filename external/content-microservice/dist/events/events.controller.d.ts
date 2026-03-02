import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateEventService } from './services/createEvent.service';
import { FindAllEventsService } from './services/findAllEvents.service';
import { FindOneEventService } from './services/findOneEvent.service';
import { UpdateEventService } from './services/updateEvent.service';
import { RemoveEventService } from './services/removeEvent.service';
import { PaginationDto } from '../common';
export declare class EventsController {
    private readonly createEventService;
    private readonly findAllEventsService;
    private readonly findOneEventService;
    private readonly updateEventService;
    private readonly removeEventService;
    constructor(createEventService: CreateEventService, findAllEventsService: FindAllEventsService, findOneEventService: FindOneEventService, updateEventService: UpdateEventService, removeEventService: RemoveEventService);
    create(dto: CreateEventDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/event.schema").Event, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/event.schema").Event & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(pagination: PaginationDto): Promise<import("../common").PaginatedResult<import("mongoose").Document<unknown, {}, import("./schemas/event.schema").Event, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/event.schema").Event & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>>;
    findOne(payload: {
        id: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/event.schema").Event, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/event.schema").Event & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    update(dto: UpdateEventDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/event.schema").Event, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/event.schema").Event & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(data: {
        id: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/event.schema").Event, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/event.schema").Event & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
}
