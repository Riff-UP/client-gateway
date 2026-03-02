import { CreateEventAttendanceDto } from './dto/create-event-attendance.dto';
import { UpdateEventAttendanceDto } from './dto/update-event-attendance.dto';
import { CreateEventAttendanceService } from './services/createEventAttendance.service';
import { FindAttendanceByEventService } from './services/findAttendanceByEvent.service';
import { FindOneEventAttendanceService } from './services/findOneEventAttendance.service';
import { UpdateEventAttendanceService } from './services/updateEventAttendance.service';
import { RemoveEventAttendanceService } from './services/removeEventAttendance.service';
export declare class EventAttendanceController {
    private readonly createEventAttendanceService;
    private readonly findAttendanceByEventService;
    private readonly findOneEventAttendanceService;
    private readonly updateEventAttendanceService;
    private readonly removeEventAttendanceService;
    constructor(createEventAttendanceService: CreateEventAttendanceService, findAttendanceByEventService: FindAttendanceByEventService, findOneEventAttendanceService: FindOneEventAttendanceService, updateEventAttendanceService: UpdateEventAttendanceService, removeEventAttendanceService: RemoveEventAttendanceService);
    create(dto: CreateEventAttendanceDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/event-attendance.schema").EventAttendance, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/event-attendance.schema").EventAttendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    findByEvent(payload: {
        event_id: string;
    }): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/event-attendance.schema").EventAttendance, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/event-attendance.schema").EventAttendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOne(payload: {
        id: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/event-attendance.schema").EventAttendance, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/event-attendance.schema").EventAttendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    update(dto: UpdateEventAttendanceDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/event-attendance.schema").EventAttendance, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/event-attendance.schema").EventAttendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(payload: {
        id: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/event-attendance.schema").EventAttendance, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/event-attendance.schema").EventAttendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
}
