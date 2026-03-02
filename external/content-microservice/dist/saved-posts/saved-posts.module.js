"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedPostsModule = void 0;
const common_1 = require("@nestjs/common");
const saved_posts_controller_1 = require("./saved-posts.controller");
const saved_posts_consumer_controller_1 = require("./saved-posts.consumer.controller");
const mongoose_1 = require("@nestjs/mongoose");
const saved_post_schema_1 = require("./schemas/saved-post.schema");
const users_module_1 = require("../users/users.module");
const createSavedPost_service_1 = require("./services/createSavedPost.service");
const findSavedPostsByUser_service_1 = require("./services/findSavedPostsByUser.service");
const removeSavedPost_service_1 = require("./services/removeSavedPost.service");
let SavedPostsModule = class SavedPostsModule {
};
exports.SavedPostsModule = SavedPostsModule;
exports.SavedPostsModule = SavedPostsModule = __decorate([
    (0, common_1.Module)({
        controllers: [saved_posts_controller_1.SavedPostsController, saved_posts_consumer_controller_1.SavedPostsConsumerController],
        providers: [
            createSavedPost_service_1.CreateSavedPostService,
            findSavedPostsByUser_service_1.FindSavedPostsByUserService,
            removeSavedPost_service_1.RemoveSavedPostService,
        ],
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: saved_post_schema_1.SavedPost.name, schema: saved_post_schema_1.SavedPostSchema },
            ]),
            users_module_1.UsersModule,
        ],
    })
], SavedPostsModule);
//# sourceMappingURL=saved-posts.module.js.map