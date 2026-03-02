import { Model } from 'mongoose';
import { EventReviewDocument } from '../schemas/event-reviews.schema';
import { CreateEventReviewDto } from '../dto/create-event-review.dto';
export declare class CreateEventReviewService {
    private readonly eventReviewModel;
    private readonly logger;
    constructor(eventReviewModel: Model<EventReviewDocument>);
    execute(dto: CreateEventReviewDto): Promise<EventReviewDocument>;
}
