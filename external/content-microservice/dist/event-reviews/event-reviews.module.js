"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventReviewsModule = void 0;
const common_1 = require("@nestjs/common");
const event_reviews_controller_1 = require("./event-reviews.controller");
const event_reviews_consumer_controller_1 = require("./event-reviews.consumer.controller");
const mongoose_1 = require("@nestjs/mongoose");
const event_reviews_schema_1 = require("./schemas/event-reviews.schema");
const users_module_1 = require("../users/users.module");
const createEventReview_service_1 = require("./services/createEventReview.service");
const findReviewsByEvent_service_1 = require("./services/findReviewsByEvent.service");
const findOneEventReview_service_1 = require("./services/findOneEventReview.service");
const updateEventReview_service_1 = require("./services/updateEventReview.service");
const removeEventReview_service_1 = require("./services/removeEventReview.service");
let EventReviewsModule = class EventReviewsModule {
};
exports.EventReviewsModule = EventReviewsModule;
exports.EventReviewsModule = EventReviewsModule = __decorate([
    (0, common_1.Module)({
        controllers: [event_reviews_controller_1.EventReviewsController, event_reviews_consumer_controller_1.EventReviewsConsumerController],
        providers: [
            createEventReview_service_1.CreateEventReviewService,
            findReviewsByEvent_service_1.FindReviewsByEventService,
            findOneEventReview_service_1.FindOneEventReviewService,
            updateEventReview_service_1.UpdateEventReviewService,
            removeEventReview_service_1.RemoveEventReviewService,
        ],
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: event_reviews_schema_1.EventReview.name, schema: event_reviews_schema_1.EventReviewSchema },
            ]),
            users_module_1.UsersModule,
        ],
    })
], EventReviewsModule);
//# sourceMappingURL=event-reviews.module.js.map