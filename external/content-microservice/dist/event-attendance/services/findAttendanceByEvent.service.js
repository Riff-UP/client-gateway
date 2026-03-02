"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var FindAttendanceByEventService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAttendanceByEventService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const event_attendance_schema_1 = require("../schemas/event-attendance.schema");
let FindAttendanceByEventService = FindAttendanceByEventService_1 = class FindAttendanceByEventService {
    attendanceModel;
    logger = new common_1.Logger(FindAttendanceByEventService_1.name);
    constructor(attendanceModel) {
        this.attendanceModel = attendanceModel;
    }
    async execute(eventId) {
        const records = await this.attendanceModel
            .find({ event_id: eventId })
            .sort({ created_at: -1 })
            .exec();
        this.logger.log(`Found ${records.length} attendance records for event ${eventId}`);
        return records;
    }
};
exports.FindAttendanceByEventService = FindAttendanceByEventService;
exports.FindAttendanceByEventService = FindAttendanceByEventService = FindAttendanceByEventService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(event_attendance_schema_1.EventAttendance.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FindAttendanceByEventService);
//# sourceMappingURL=findAttendanceByEvent.service.js.map