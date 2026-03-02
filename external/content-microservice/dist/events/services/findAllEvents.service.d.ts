import { Model } from 'mongoose';
import { EventDocument } from '../schemas/event.schema';
import { PaginationDto, PaginatedResult } from '../../common';
export declare class FindAllEventsService {
    private readonly eventModel;
    private readonly logger;
    constructor(eventModel: Model<EventDocument>);
    execute(pagination?: PaginationDto): Promise<PaginatedResult<EventDocument>>;
}
