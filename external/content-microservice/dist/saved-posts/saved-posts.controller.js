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
exports.SavedPostsController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const create_saved_post_dto_1 = require("./dto/create-saved-post.dto");
const createSavedPost_service_1 = require("./services/createSavedPost.service");
const findSavedPostsByUser_service_1 = require("./services/findSavedPostsByUser.service");
const removeSavedPost_service_1 = require("./services/removeSavedPost.service");
let SavedPostsController = class SavedPostsController {
    createSavedPostService;
    findSavedPostsByUserService;
    removeSavedPostService;
    constructor(createSavedPostService, findSavedPostsByUserService, removeSavedPostService) {
        this.createSavedPostService = createSavedPostService;
        this.findSavedPostsByUserService = findSavedPostsByUserService;
        this.removeSavedPostService = removeSavedPostService;
    }
    create(dto) {
        return this.createSavedPostService.execute(dto);
    }
    findByUser(payload) {
        return this.findSavedPostsByUserService.execute(payload.sql_user_id);
    }
    remove(payload) {
        return this.removeSavedPostService.execute(payload.id);
    }
};
exports.SavedPostsController = SavedPostsController;
__decorate([
    (0, microservices_1.MessagePattern)('createSavedPost'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_saved_post_dto_1.CreateSavedPostDto]),
    __metadata("design:returntype", void 0)
], SavedPostsController.prototype, "create", null);
__decorate([
    (0, microservices_1.MessagePattern)('findSavedPostsByUser'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SavedPostsController.prototype, "findByUser", null);
__decorate([
    (0, microservices_1.MessagePattern)('removeSavedPost'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SavedPostsController.prototype, "remove", null);
exports.SavedPostsController = SavedPostsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [createSavedPost_service_1.CreateSavedPostService,
        findSavedPostsByUser_service_1.FindSavedPostsByUserService,
        removeSavedPost_service_1.RemoveSavedPostService])
], SavedPostsController);
//# sourceMappingURL=saved-posts.controller.js.map