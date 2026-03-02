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
exports.SavedPostsConsumerController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const createSavedPost_service_1 = require("./services/createSavedPost.service");
const users_service_1 = require("../users/users.service");
const generatedToken_dto_1 = require("../posts/dto/generatedToken.dto");
let SavedPostsConsumerController = class SavedPostsConsumerController {
    createSavedPostService;
    usersService;
    logger = new common_1.Logger('SavedPostsConsumer');
    constructor(createSavedPostService, usersService) {
        this.createSavedPostService = createSavedPostService;
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
};
exports.SavedPostsConsumerController = SavedPostsConsumerController;
__decorate([
    (0, microservices_1.EventPattern)('auth.tokenGenerated'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generatedToken_dto_1.AuthTokenGeneratedDto]),
    __metadata("design:returntype", Promise)
], SavedPostsConsumerController.prototype, "handleAuthToken", null);
exports.SavedPostsConsumerController = SavedPostsConsumerController = __decorate([
    (0, common_1.Controller)('saved-posts-consumer'),
    __metadata("design:paramtypes", [createSavedPost_service_1.CreateSavedPostService,
        users_service_1.UsersService])
], SavedPostsConsumerController);
//# sourceMappingURL=saved-posts.consumer.controller.js.map