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
var UpdateEventReviewService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEventReviewService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const event_reviews_schema_1 = require("../schemas/event-reviews.schema");
const rpc_exception_helper_1 = require("../../common/helpers/rpc-exception.helper");
let UpdateEventReviewService = UpdateEventReviewService_1 = class UpdateEventReviewService {
    eventReviewModel;
    logger = new common_1.Logger(UpdateEventReviewService_1.name);
    constructor(eventReviewModel) {
        this.eventReviewModel = eventReviewModel;
    }
    async execute(id, dto) {
        const updated = await this.eventReviewModel
            .findByIdAndUpdate(id, dto, { new: true })
            .exec();
        if (!updated) {
            rpc_exception_helper_1.RpcExceptionHelper.notFound('EventReview', id);
        }
        this.logger.log(`Review updated: ${id}`);
        return updated;
    }
};
exports.UpdateEventReviewService = UpdateEventReviewService;
exports.UpdateEventReviewService = UpdateEventReviewService = UpdateEventReviewService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(event_reviews_schema_1.EventReview.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UpdateEventReviewService);
//# sourceMappingURL=updateEventReview.service.js.map