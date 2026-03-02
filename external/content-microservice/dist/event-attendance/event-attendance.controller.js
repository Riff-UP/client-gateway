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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventAttendanceController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const create_event_attendance_dto_1 = require("./dto/create-event-attendance.dto");
const update_event_attendance_dto_1 = require("./dto/update-event-attendance.dto");
const createEventAttendance_service_1 = require("./services/createEventAttendance.service");
const findAttendanceByEvent_service_1 = require("./services/findAttendanceByEvent.service");
const findOneEventAttendance_service_1 = require("./services/findOneEventAttendance.service");
const updateEventAttendance_service_1 = require("./services/updateEventAttendance.service");
const removeEventAttendance_service_1 = require("./services/removeEventAttendance.service");
let EventAttendanceController = class EventAttendanceController {
    createEventAttendanceService;
    findAttendanceByEventService;
    findOneEventAttendanceService;
    updateEventAttendanceService;
    removeEventAttendanceService;
    constructor(createEventAttendanceService, findAttendanceByEventService, findOneEventAttendanceService, updateEventAttendanceService, removeEventAttendanceService) {
        this.createEventAttendanceService = createEventAttendanceService;
        this.findAttendanceByEventService = findAttendanceByEventService;
        this.findOneEventAttendanceService = findOneEventAttendanceService;
        this.updateEventAttendanceService = updateEventAttendanceService;
        this.removeEventAttendanceService = removeEventAttendanceService;
    }
    create(dto) {
        return this.createEventAttendanceService.execute(dto);
    }
    findByEvent(payload) {
        return this.findAttendanceByEventService.execute(payload.event_id);
    }
    findOne(payload) {
        return this.findOneEventAttendanceService.execute(payload.id);
    }
    update(dto) {
        return this.updateEventAttendanceService.execute(dto.id, dto);
    }
    remove(payload) {
        return this.removeEventAttendanceService.execute(payload.id);
    }
};
exports.EventAttendanceController = EventAttendanceController;
__decorate([
    (0, microservices_1.MessagePattern)('createEventAttendance'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_event_attendance_dto_1.CreateEventAttendanceDto]),
    __metadata("design:returntype", void 0)
], EventAttendanceController.prototype, "create", null);
__decorate([
    (0, microservices_1.MessagePattern)('findAttendanceByEvent'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventAttendanceController.prototype, "findByEvent", null);
__decorate([
    (0, microservices_1.MessagePattern)('findOneEventAttendance'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventAttendanceController.prototype, "findOne", null);
__decorate([
    (0, microservices_1.MessagePattern)('updateEventAttendance'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_event_attendance_dto_1.UpdateEventAttendanceDto]),
    __metadata("design:returntype", void 0)
], EventAttendanceController.prototype, "update", null);
__decorate([
    (0, microservices_1.MessagePattern)('removeEventAttendance'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventAttendanceController.prototype, "remove", null);
exports.EventAttendanceController = EventAttendanceController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [createEventAttendance_service_1.CreateEventAttendanceService,
        findAttendanceByEvent_service_1.FindAttendanceByEventService,
        findOneEventAttendance_service_1.FindOneEventAttendanceService,
        updateEventAttendance_service_1.UpdateEventAttendanceService,
        removeEventAttendance_service_1.RemoveEventAttendanceService])
], EventAttendanceController);
//# sourceMappingURL=event-attendance.controller.js.map