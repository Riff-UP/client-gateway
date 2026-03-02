import { Model } from 'mongoose';
import { EventDocument } from '../schemas/event.schema';
import { CreateEventDto } from '../dto/create-event.dto';
export declare class CreateEventService {
    private readonly eventModel;
    private readonly logger;
    private readonly client;
    constructor(eventModel: Model<EventDocument>);
    execute(dto: CreateEventDto): Promise<EventDocument>;
}
