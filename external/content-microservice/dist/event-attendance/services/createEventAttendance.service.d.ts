import { Model } from 'mongoose';
import { EventAttendanceDocument } from '../schemas/event-attendance.schema';
import { CreateEventAttendanceDto } from '../dto/create-event-attendance.dto';
export declare class CreateEventAttendanceService {
    private readonly attendanceModel;
    private readonly logger;
    constructor(attendanceModel: Model<EventAttendanceDocument>);
    execute(dto: CreateEventAttendanceDto): Promise<EventAttendanceDocument>;
}
