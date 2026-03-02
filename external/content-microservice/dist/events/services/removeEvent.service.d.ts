import { Model } from 'mongoose';
import { EventDocument } from '../schemas/event.schema';
export declare class RemoveEventService {
    private readonly eventModel;
    private readonly logger;
    private readonly client;
    constructor(eventModel: Model<EventDocument>);
    execute(id: string): Promise<EventDocument>;
}
