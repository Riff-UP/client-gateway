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
var FindAllEventsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAllEventsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const event_schema_1 = require("../schemas/event.schema");
let FindAllEventsService = FindAllEventsService_1 = class FindAllEventsService {
    eventModel;
    logger = new common_1.Logger(FindAllEventsService_1.name);
    constructor(eventModel) {
        this.eventModel = eventModel;
    }
    async execute(pagination) {
        const page = pagination?.page ?? 1;
        const limit = pagination?.limit ?? 20;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.eventModel
                .find()
                .sort({ created_at: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.eventModel.countDocuments().exec(),
        ]);
        this.logger.log(`Found ${data.length} events (page ${page}/${Math.ceil(total / limit)})`);
        return {
            data,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / limit),
                limit,
            },
        };
    }
};
exports.FindAllEventsService = FindAllEventsService;
exports.FindAllEventsService = FindAllEventsService = FindAllEventsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(event_schema_1.Event.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FindAllEventsService);
//# sourceMappingURL=findAllEvents.service.js.map