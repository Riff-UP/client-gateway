"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsModule = void 0;
const common_1 = require("@nestjs/common");
const posts_controller_1 = require("./posts.controller");
const posts_consumer_controller_1 = require("./posts.consumer.controller");
const createPost_service_1 = require("./services/createPost.service");
const findAllPosts_service_1 = require("./services/findAllPosts.service");
const findOnePost_service_1 = require("./services/findOnePost.service");
const updatePost_service_1 = require("./services/updatePost.service");
const removePost_service_1 = require("./services/removePost.service");
const upload_service_1 = require("../utils/services/upload.service");
const storage_service_1 = require("../utils/services/storage.service");
const mongoose_1 = require("@nestjs/mongoose");
const post_schema_1 = require("./schemas/post.schema");
const users_module_1 = require("../users/users.module");
let PostsModule = class PostsModule {
};
exports.PostsModule = PostsModule;
exports.PostsModule = PostsModule = __decorate([
    (0, common_1.Module)({
        controllers: [posts_controller_1.PostsController, posts_consumer_controller_1.postsConsumerController],
        providers: [
            createPost_service_1.createPostService,
            findAllPosts_service_1.FindAllPostsService,
            findOnePost_service_1.FindOnePostService,
            updatePost_service_1.UpdatePostService,
            removePost_service_1.RemovePostService,
            upload_service_1.UploadService,
            storage_service_1.StorageService,
        ],
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: post_schema_1.Post.name, schema: post_schema_1.PostSchema }]),
            users_module_1.UsersModule,
        ],
    })
], PostsModule);
//# sourceMappingURL=posts.module.js.map