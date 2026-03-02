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
var FindReactionsByPostService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindReactionsByPostService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const post_reactions_schema_1 = require("../schemas/post-reactions.schema");
let FindReactionsByPostService = FindReactionsByPostService_1 = class FindReactionsByPostService {
    postReactionModel;
    logger = new common_1.Logger(FindReactionsByPostService_1.name);
    constructor(postReactionModel) {
        this.postReactionModel = postReactionModel;
    }
    async execute(postId) {
        const reactions = await this.postReactionModel
            .find({ post_id: postId })
            .exec();
        this.logger.log(`Found ${reactions.length} reactions for post ${postId}`);
        return reactions;
    }
};
exports.FindReactionsByPostService = FindReactionsByPostService;
exports.FindReactionsByPostService = FindReactionsByPostService = FindReactionsByPostService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(post_reactions_schema_1.PostReaction.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FindReactionsByPostService);
//# sourceMappingURL=findReactionsByPost.service.js.map