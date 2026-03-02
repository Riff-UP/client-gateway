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
exports.EventReviewsConsumerController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const create_event_review_dto_1 = require("./dto/create-event-review.dto");
const createEventReview_service_1 = require("./services/createEventReview.service");
const users_service_1 = require("../users/users.service");
const generatedToken_dto_1 = require("../posts/dto/generatedToken.dto");
let EventReviewsConsumerController = class EventReviewsConsumerController {
    createEventReviewService;
    usersService;
    logger = new common_1.Logger('EventReviewsConsumer');
    constructor(createEventReviewService, usersService) {
        this.createEventReviewService = createEventReviewService;
        this.usersService = usersService;
    }
    async handleAuthToken(data) {
        this.logger.log('auth.tokenGenerated received');
        try {
            await this.usersService.upsert(data.user, data.token);
            this.logger.log(`User ref upserted: ${data.user?.id || data.user?.user_id}`);
        }
        catch (err) {
            this.logger.error('Failed to upsert user ref', err);
        }
    }
    async handleReviewCreated(payload) {
        this.logger.log('events.reviewCreated received');
        try {
            await this.createEventReviewService.execute(payload);
            this.logger.log('Event review persisted from consumer');
        }
        catch (err) {
            this.logger.error('Error persisting review from consumer', err);
        }
    }
};
exports.EventReviewsConsumerController = EventReviewsConsumerController;
__decorate([
    (0, microservices_1.EventPattern)('auth.tokenGenerated'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generatedToken_dto_1.AuthTokenGeneratedDto]),
    __metadata("design:returntype", Promise)
], EventReviewsConsumerController.prototype, "handleAuthToken", null);
__decorate([
    (0, microservices_1.EventPattern)('events.reviewCreated'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_event_review_dto_1.CreateEventReviewDto]),
    __metadata("design:returntype", Promise)
], EventReviewsConsumerController.prototype, "handleReviewCreated", null);
exports.EventReviewsConsumerController = EventReviewsConsumerController = __decorate([
    (0, common_1.Controller)('event-reviews-consumer'),
    __metadata("design:paramtypes", [createEventReview_service_1.CreateEventReviewService,
        users_service_1.UsersService])
], EventReviewsConsumerController);
//# sourceMappingURL=event-reviews.consumer.controller.js.map