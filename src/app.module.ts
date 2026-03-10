import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  UsersModule,
  SocialMediaModule,
  PasswordResetsModule,
  UserFollowsModule,
} from './users/modules';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import {
  PostsModule,
  SavedPostsModule,
  SavedEventsModule,
  AnalyticsModule,
} from './content/modules';
import { EventsModule } from './content/modules';
import { EventAttendanceModule } from './content/modules';
import { EventReviewsModule } from './content/modules';
import { PostReactionsModule } from './content/modules';
import { UserStatsModule } from './users/modules/user_stats/user-stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    NotificationsModule,
    AnalyticsModule,
    EventReviewsModule,
    EventAttendanceModule,
    EventsModule,
    PostReactionsModule,
    SocialMediaModule,
    SavedPostsModule,
    SavedEventsModule,
    PostsModule,
    PasswordResetsModule,
    UserFollowsModule,
    UserStatsModule,
  ],
})
export class AppModule {}
