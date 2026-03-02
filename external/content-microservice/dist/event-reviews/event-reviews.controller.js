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
exports.EventReviewsController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const create_event_review_dto_1 = require("./dto/create-event-review.dto");
const update_event_review_dto_1 = require("./dto/update-event-review.dto");
const createEventReview_service_1 = require("./services/createEventReview.service");
const findReviewsByEvent_service_1 = require("./services/findReviewsByEvent.service");
const findOneEventReview_service_1 = require("./services/findOneEventReview.service");
const updateEventReview_service_1 = require("./services/updateEventReview.service");
const removeEventReview_service_1 = require("./services/removeEventReview.service");
let EventReviewsController = class EventReviewsController {
    createEventReviewService;
    findReviewsByEventService;
    findOneEventReviewService;
    updateEventReviewService;
    removeEventReviewService;
    constructor(createEventReviewService, findReviewsByEventService, findOneEventReviewService, updateEventReviewService, removeEventReviewService) {
        this.createEventReviewService = createEventReviewService;
        this.findReviewsByEventService = findReviewsByEventService;
        this.findOneEventReviewService = findOneEventReviewService;
        this.updateEventReviewService = updateEventReviewService;
        this.removeEventReviewService = removeEventReviewService;
    }
    create(dto) {
        return this.createEventReviewService.execute(dto);
    }
    findByEvent(payload) {
        return this.findReviewsByEventService.execute(payload.event_id);
    }
    findOne(payload) {
        return this.findOneEventReviewService.execute(payload.id);
    }
    update(dto) {
        return this.updateEventReviewService.execute(dto.id, dto);
    }
    remove(payload) {
        return this.removeEventReviewService.execute(payload.id);
    }
};
exports.EventReviewsController = EventReviewsController;
__decorate([
    (0, microservices_1.MessagePattern)('createEventReview'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_event_review_dto_1.CreateEventReviewDto]),
    __metadata("design:returntype", void 0)
], EventReviewsController.prototype, "create", null);
__decorate([
    (0, microservices_1.MessagePattern)('findReviewsByEvent'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventReviewsController.prototype, "findByEvent", null);
__decorate([
    (0, microservices_1.MessagePattern)('findOneEventReview'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventReviewsController.prototype, "findOne", null);
__decorate([
    (0, microservices_1.MessagePattern)('updateEventReview'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_event_review_dto_1.UpdateEventReviewDto]),
    __metadata("design:returntype", void 0)
], EventReviewsController.prototype, "update", null);
__decorate([
    (0, microservices_1.MessagePattern)('removeEventReview'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventReviewsController.prototype, "remove", null);
exports.EventReviewsController = EventReviewsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [createEventReview_service_1.CreateEventReviewService,
        findReviewsByEvent_service_1.FindReviewsByEventService,
        findOneEventReview_service_1.FindOneEventReviewService,
        updateEventReview_service_1.UpdateEventReviewService,
        removeEventReview_service_1.RemoveEventReviewService])
], EventReviewsController);
//# sourceMappingURL=event-reviews.controller.js.map