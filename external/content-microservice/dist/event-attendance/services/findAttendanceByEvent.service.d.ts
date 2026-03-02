import { Model } from 'mongoose';
import { EventAttendanceDocument } from '../schemas/event-attendance.schema';
export declare class FindAttendanceByEventService {
    private readonly attendanceModel;
    private readonly logger;
    constructor(attendanceModel: Model<EventAttendanceDocument>);
    execute(eventId: string): Promise<EventAttendanceDocument[]>;
}
