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
exports.PostReactionsController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const create_post_reaction_dto_1 = require("./dto/create-post-reaction.dto");
const createPostReaction_service_1 = require("./services/createPostReaction.service");
const findReactionsByPost_service_1 = require("./services/findReactionsByPost.service");
const removePostReaction_service_1 = require("./services/removePostReaction.service");
let PostReactionsController = class PostReactionsController {
    createPostReactionService;
    findReactionsByPostService;
    removePostReactionService;
    constructor(createPostReactionService, findReactionsByPostService, removePostReactionService) {
        this.createPostReactionService = createPostReactionService;
        this.findReactionsByPostService = findReactionsByPostService;
        this.removePostReactionService = removePostReactionService;
    }
    create(dto) {
        return this.createPostReactionService.execute(dto);
    }
    findByPost(payload) {
        return this.findReactionsByPostService.execute(payload.post_id);
    }
    remove(payload) {
        return this.removePostReactionService.execute(payload.id);
    }
};
exports.PostReactionsController = PostReactionsController;
__decorate([
    (0, microservices_1.MessagePattern)('createPostReaction'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_post_reaction_dto_1.CreatePostReactionDto]),
    __metadata("design:returntype", void 0)
], PostReactionsController.prototype, "create", null);
__decorate([
    (0, microservices_1.MessagePattern)('findReactionsByPost'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PostReactionsController.prototype, "findByPost", null);
__decorate([
    (0, microservices_1.MessagePattern)('removePostReaction'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PostReactionsController.prototype, "remove", null);
exports.PostReactionsController = PostReactionsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [createPostReaction_service_1.CreatePostReactionService,
        findReactionsByPost_service_1.FindReactionsByPostService,
        removePostReaction_service_1.RemovePostReactionService])
], PostReactionsController);
//# sourceMappingURL=post-reactions.controller.js.map