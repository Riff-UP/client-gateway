import { Model } from 'mongoose';
import { EventReviewDocument } from '../schemas/event-reviews.schema';
export declare class RemoveEventReviewService {
    private readonly eventReviewModel;
    private readonly logger;
    constructor(eventReviewModel: Model<EventReviewDocument>);
    execute(id: string): Promise<EventReviewDocument>;
}
