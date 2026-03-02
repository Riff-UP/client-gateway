import { Model } from 'mongoose';
import { EventDocument } from '../schemas/event.schema';
import { UpdateEventDto } from '../dto/update-event.dto';
export declare class UpdateEventService {
    private readonly eventModel;
    private readonly logger;
    private readonly client;
    constructor(eventModel: Model<EventDocument>);
    execute(id: string, dto: UpdateEventDto): Promise<EventDocument>;
}
