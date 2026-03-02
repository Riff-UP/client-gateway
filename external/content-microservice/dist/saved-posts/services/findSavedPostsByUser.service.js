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
var FindSavedPostsByUserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindSavedPostsByUserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const saved_post_schema_1 = require("../schemas/saved-post.schema");
let FindSavedPostsByUserService = FindSavedPostsByUserService_1 = class FindSavedPostsByUserService {
    savedPostModel;
    logger = new common_1.Logger(FindSavedPostsByUserService_1.name);
    constructor(savedPostModel) {
        this.savedPostModel = savedPostModel;
    }
    async execute(sqlUserId) {
        const savedPosts = await this.savedPostModel
            .find({ sql_user_id: sqlUserId })
            .sort({ saved_at: -1 })
            .exec();
        this.logger.log(`Found ${savedPosts.length} saved posts for user ${sqlUserId}`);
        return savedPosts;
    }
};
exports.FindSavedPostsByUserService = FindSavedPostsByUserService;
exports.FindSavedPostsByUserService = FindSavedPostsByUserService = FindSavedPostsByUserService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(saved_post_schema_1.SavedPost.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FindSavedPostsByUserService);
//# sourceMappingURL=findSavedPostsByUser.service.js.map