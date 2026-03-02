"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostReactionsModule = void 0;
const common_1 = require("@nestjs/common");
const post_reactions_controller_1 = require("./post-reactions.controller");
const post_reactions_consumer_controller_1 = require("./post-reactions.consumer.controller");
const mongoose_1 = require("@nestjs/mongoose");
const post_reactions_schema_1 = require("./schemas/post-reactions.schema");
const users_module_1 = require("../users/users.module");
const createPostReaction_service_1 = require("./services/createPostReaction.service");
const findReactionsByPost_service_1 = require("./services/findReactionsByPost.service");
const removePostReaction_service_1 = require("./services/removePostReaction.service");
let PostReactionsModule = class PostReactionsModule {
};
exports.PostReactionsModule = PostReactionsModule;
exports.PostReactionsModule = PostReactionsModule = __decorate([
    (0, common_1.Module)({
        controllers: [post_reactions_controller_1.PostReactionsController, post_reactions_consumer_controller_1.PostReactionsConsumerController],
        providers: [
            createPostReaction_service_1.CreatePostReactionService,
            findReactionsByPost_service_1.FindReactionsByPostService,
            removePostReaction_service_1.RemovePostReactionService,
        ],
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: post_reactions_schema_1.PostReaction.name, schema: post_reactions_schema_1.PostReactionSchema },
            ]),
            users_module_1.UsersModule,
        ],
    })
], PostReactionsModule);
//# sourceMappingURL=post-reactions.module.js.map