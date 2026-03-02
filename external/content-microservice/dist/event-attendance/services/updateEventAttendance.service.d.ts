import { Model } from 'mongoose';
import { EventAttendanceDocument } from '../schemas/event-attendance.schema';
import { UpdateEventAttendanceDto } from '../dto/update-event-attendance.dto';
export declare class UpdateEventAttendanceService {
    private readonly attendanceModel;
    private readonly logger;
    constructor(attendanceModel: Model<EventAttendanceDocument>);
    execute(id: string, dto: UpdateEventAttendanceDto): Promise<EventAttendanceDocument>;
}
