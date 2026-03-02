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
var RemoveEventService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveEventService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const microservices_1 = require("@nestjs/microservices");
const event_schema_1 = require("../schemas/event.schema");
const rpc_exception_helper_1 = require("../../common/helpers/rpc-exception.helper");
const envs_1 = require("../../config/envs");
let RemoveEventService = RemoveEventService_1 = class RemoveEventService {
    eventModel;
    logger = new common_1.Logger(RemoveEventService_1.name);
    client;
    constructor(eventModel) {
        this.eventModel = eventModel;
        this.client = microservices_1.ClientProxyFactory.create({
            transport: microservices_1.Transport.RMQ,
            options: {
                urls: [envs_1.envs.rabbitUrl],
                queue: 'riff_queue',
                queueOptions: { durable: true },
            },
        });
    }
    async execute(id) {
        const existing = await this.eventModel.findById(id).exec();
        if (!existing) {
            rpc_exception_helper_1.RpcExceptionHelper.notFound('Event', id);
        }
        const removed = await this.eventModel.findByIdAndDelete(id).exec();
        this.client.emit('event.cancelled', {
            type: 'event_cancelled',
            message: `Event cancelled: ${removed.title}`,
            userId: removed.sql_user_id,
            eventId: id,
        });
        this.logger.log(`Event removed and cancellation emitted: ${id}`);
        return removed;
    }
};
exports.RemoveEventService = RemoveEventService;
exports.RemoveEventService = RemoveEventService = RemoveEventService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(event_schema_1.Event.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], RemoveEventService);
//# sourceMappingURL=removeEvent.service.js.map