"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const posts_module_1 = require("./posts/posts.module");
const events_module_1 = require("./events/events.module");
const event_attendance_module_1 = require("./event-attendance/event-attendance.module");
const event_reviews_module_1 = require("./event-reviews/event-reviews.module");
const post_reactions_module_1 = require("./post-reactions/post-reactions.module");
const saved_posts_module_1 = require("./saved-posts/saved-posts.module");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const envs_1 = require("./config/envs");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            mongoose_1.MongooseModule.forRoot(envs_1.envs.mongoUri),
            posts_module_1.PostsModule,
            events_module_1.EventsModule,
            event_attendance_module_1.EventAttendanceModule,
            event_reviews_module_1.EventReviewsModule,
            post_reactions_module_1.PostReactionsModule,
            saved_posts_module_1.SavedPostsModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map