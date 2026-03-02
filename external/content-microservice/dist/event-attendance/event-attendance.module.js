"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventAttendanceModule = void 0;
const common_1 = require("@nestjs/common");
const event_attendance_controller_1 = require("./event-attendance.controller");
const event_attendance_consumer_controller_1 = require("./event-attendance.consumer.controller");
const mongoose_1 = require("@nestjs/mongoose");
const event_attendance_schema_1 = require("./schemas/event-attendance.schema");
const users_module_1 = require("../users/users.module");
const createEventAttendance_service_1 = require("./services/createEventAttendance.service");
const findAttendanceByEvent_service_1 = require("./services/findAttendanceByEvent.service");
const findOneEventAttendance_service_1 = require("./services/findOneEventAttendance.service");
const updateEventAttendance_service_1 = require("./services/updateEventAttendance.service");
const removeEventAttendance_service_1 = require("./services/removeEventAttendance.service");
let EventAttendanceModule = class EventAttendanceModule {
};
exports.EventAttendanceModule = EventAttendanceModule;
exports.EventAttendanceModule = EventAttendanceModule = __decorate([
    (0, common_1.Module)({
        controllers: [event_attendance_controller_1.EventAttendanceController, event_attendance_consumer_controller_1.EventAttendanceConsumerController],
        providers: [
            createEventAttendance_service_1.CreateEventAttendanceService,
            findAttendanceByEvent_service_1.FindAttendanceByEventService,
            findOneEventAttendance_service_1.FindOneEventAttendanceService,
            updateEventAttendance_service_1.UpdateEventAttendanceService,
            removeEventAttendance_service_1.RemoveEventAttendanceService,
        ],
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: event_attendance_schema_1.EventAttendance.name, schema: event_attendance_schema_1.EventAttendanceSchema },
            ]),
            users_module_1.UsersModule,
        ],
    })
], EventAttendanceModule);
//# sourceMappingURL=event-attendance.module.js.map