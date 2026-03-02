import { Model } from 'mongoose';
import { EventAttendanceDocument } from '../schemas/event-attendance.schema';
export declare class FindOneEventAttendanceService {
    private readonly attendanceModel;
    private readonly logger;
    constructor(attendanceModel: Model<EventAttendanceDocument>);
    execute(id: string): Promise<EventAttendanceDocument>;
}
