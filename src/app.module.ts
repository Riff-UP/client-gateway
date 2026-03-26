import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
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

    // Rate limiting global — 100 requests por minuto por IP
    ThrottlerModule.forRoot([
      {
        name: 'global',
        ttl: 60_000,
        limit: 100,
      },
    ]),

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
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}