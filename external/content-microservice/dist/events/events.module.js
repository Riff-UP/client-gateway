"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsModule = void 0;
const common_1 = require("@nestjs/common");
const events_controller_1 = require("./events.controller");
const events_consumer_controller_1 = require("./events.consumer.controller");
const mongoose_1 = require("@nestjs/mongoose");
const event_schema_1 = require("./schemas/event.schema");
const users_module_1 = require("../users/users.module");
const createEvent_service_1 = require("./services/createEvent.service");
const findAllEvents_service_1 = require("./services/findAllEvents.service");
const findOneEvent_service_1 = require("./services/findOneEvent.service");
const updateEvent_service_1 = require("./services/updateEvent.service");
const removeEvent_service_1 = require("./services/removeEvent.service");
let EventsModule = class EventsModule {
};
exports.EventsModule = EventsModule;
exports.EventsModule = EventsModule = __decorate([
    (0, common_1.Module)({
        controllers: [events_controller_1.EventsController, events_consumer_controller_1.EventsConsumerController],
        providers: [
            createEvent_service_1.CreateEventService,
            findAllEvents_service_1.FindAllEventsService,
            findOneEvent_service_1.FindOneEventService,
            updateEvent_service_1.UpdateEventService,
            removeEvent_service_1.RemoveEventService,
        ],
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: event_schema_1.Event.name, schema: event_schema_1.EventSchema }]),
            users_module_1.UsersModule,
        ],
    })
], EventsModule);
//# sourceMappingURL=events.module.js.map