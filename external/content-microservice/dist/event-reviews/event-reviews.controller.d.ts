import { CreateEventReviewDto } from './dto/create-event-review.dto';
import { UpdateEventReviewDto } from './dto/update-event-review.dto';
import { CreateEventReviewService } from './services/createEventReview.service';
import { FindReviewsByEventService } from './services/findReviewsByEvent.service';
import { FindOneEventReviewService } from './services/findOneEventReview.service';
import { UpdateEventReviewService } from './services/updateEventReview.service';
import { RemoveEventReviewService } from './services/removeEventReview.service';
export declare class EventReviewsController {
    private readonly createEventReviewService;
    private readonly findReviewsByEventService;
    private readonly findOneEventReviewService;
    private readonly updateEventReviewService;
    private readonly removeEventReviewService;
    constructor(createEventReviewService: CreateEventReviewService, findReviewsByEventService: FindReviewsByEventService, findOneEventReviewService: FindOneEventReviewService, updateEventReviewService: UpdateEventReviewService, removeEventReviewService: RemoveEventReviewService);
    create(dto: CreateEventReviewDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/event-reviews.schema").EventReview, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/event-reviews.schema").EventReview & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    findByEvent(payload: {
        event_id: string;
    }): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/event-reviews.schema").EventReview, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/event-reviews.schema").EventReview & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOne(payload: {
        id: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/event-reviews.schema").EventReview, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/event-reviews.schema").EventReview & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    update(dto: UpdateEventReviewDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/event-reviews.schema").EventReview, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/event-reviews.schema").EventReview & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(payload: {
        id: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/event-reviews.schema").EventReview, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/event-reviews.schema").EventReview & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
}
