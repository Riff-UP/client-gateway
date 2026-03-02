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
var CreatePostReactionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePostReactionService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const post_reactions_schema_1 = require("../schemas/post-reactions.schema");
let CreatePostReactionService = CreatePostReactionService_1 = class CreatePostReactionService {
    postReactionModel;
    logger = new common_1.Logger(CreatePostReactionService_1.name);
    constructor(postReactionModel) {
        this.postReactionModel = postReactionModel;
    }
    async execute(dto) {
        const existing = await this.postReactionModel
            .findOne({
            sql_user_id: dto.sql_user_id,
            post_id: dto.post_id,
            type: dto.type,
        })
            .exec();
        if (existing) {
            await this.postReactionModel.findByIdAndDelete(existing._id).exec();
            this.logger.log(`Reaction removed (toggle): user ${dto.sql_user_id} on post ${dto.post_id}`);
            return { reaction: existing, action: 'removed' };
        }
        const reaction = await this.postReactionModel.create(dto);
        this.logger.log(`Reaction created: user ${dto.sql_user_id} on post ${dto.post_id} [${dto.type}]`);
        return { reaction, action: 'created' };
    }
};
exports.CreatePostReactionService = CreatePostReactionService;
exports.CreatePostReactionService = CreatePostReactionService = CreatePostReactionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(post_reactions_schema_1.PostReaction.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CreatePostReactionService);
//# sourceMappingURL=createPostReaction.service.js.map