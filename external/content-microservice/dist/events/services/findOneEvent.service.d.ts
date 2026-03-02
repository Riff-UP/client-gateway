import { Model } from 'mongoose';
import { EventDocument } from '../schemas/event.schema';
export declare class FindOneEventService {
    private readonly eventModel;
    private readonly logger;
    constructor(eventModel: Model<EventDocument>);
    execute(id: string): Promise<EventDocument>;
}
