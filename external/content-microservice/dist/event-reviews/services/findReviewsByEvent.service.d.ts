import { Model } from 'mongoose';
import { EventReviewDocument } from '../schemas/event-reviews.schema';
export declare class FindReviewsByEventService {
    private readonly eventReviewModel;
    private readonly logger;
    constructor(eventReviewModel: Model<EventReviewDocument>);
    execute(eventId: string): Promise<EventReviewDocument[]>;
}
