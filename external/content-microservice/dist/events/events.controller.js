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
exports.EventsController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const create_event_dto_1 = require("./dto/create-event.dto");
const update_event_dto_1 = require("./dto/update-event.dto");
const createEvent_service_1 = require("./services/createEvent.service");
const findAllEvents_service_1 = require("./services/findAllEvents.service");
const findOneEvent_service_1 = require("./services/findOneEvent.service");
const updateEvent_service_1 = require("./services/updateEvent.service");
const removeEvent_service_1 = require("./services/removeEvent.service");
const common_2 = require("../common");
let EventsController = class EventsController {
    createEventService;
    findAllEventsService;
    findOneEventService;
    updateEventService;
    removeEventService;
    constructor(createEventService, findAllEventsService, findOneEventService, updateEventService, removeEventService) {
        this.createEventService = createEventService;
        this.findAllEventsService = findAllEventsService;
        this.findOneEventService = findOneEventService;
        this.updateEventService = updateEventService;
        this.removeEventService = removeEventService;
    }
    create(dto) {
        return this.createEventService.execute(dto);
    }
    findAll(pagination) {
        return this.findAllEventsService.execute(pagination);
    }
    findOne(payload) {
        return this.findOneEventService.execute(payload.id);
    }
    update(dto) {
        return this.updateEventService.execute(dto.id, dto);
    }
    remove(data) {
        return this.removeEventService.execute(data.id);
    }
};
exports.EventsController = EventsController;
__decorate([
    (0, microservices_1.MessagePattern)('createEvent'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_event_dto_1.CreateEventDto]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "create", null);
__decorate([
    (0, microservices_1.MessagePattern)('findAllEvents'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_2.PaginationDto]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "findAll", null);
__decorate([
    (0, microservices_1.MessagePattern)('findOneEvent'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "findOne", null);
__decorate([
    (0, microservices_1.MessagePattern)('updateEvent'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_event_dto_1.UpdateEventDto]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "update", null);
__decorate([
    (0, microservices_1.MessagePattern)('removeEvent'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "remove", null);
exports.EventsController = EventsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [createEvent_service_1.CreateEventService,
        findAllEvents_service_1.FindAllEventsService,
        findOneEvent_service_1.FindOneEventService,
        updateEvent_service_1.UpdateEventService,
        removeEvent_service_1.RemoveEventService])
], EventsController);
//# sourceMappingURL=events.controller.js.map