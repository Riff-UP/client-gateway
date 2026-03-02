import { Model } from 'mongoose';
import { EventReviewDocument } from '../schemas/event-reviews.schema';
import { UpdateEventReviewDto } from '../dto/update-event-review.dto';
export declare class UpdateEventReviewService {
    private readonly eventReviewModel;
    private readonly logger;
    constructor(eventReviewModel: Model<EventReviewDocument>);
    execute(id: string, dto: UpdateEventReviewDto): Promise<EventReviewDocument>;
}
