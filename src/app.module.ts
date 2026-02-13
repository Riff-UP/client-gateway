import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PostsModule, SavedPostsModule } from './content/modules';
import { EventsModule } from './content/modules';
import { EventAttendanceModule } from './content/modules';
import { EventReviewsModule } from './content/modules';
import { PostReactionsModule } from './content/modules';
import { SocialMediaModule } from './users/modules/social_media/social-media.module';
import { PasswordResetsModule } from './users/modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    NotificationsModule,
    EventsModule,
    EventAttendanceModule,
    EventReviewsModule,
    PostReactionsModule,
    SocialMediaModule,
    SavedPostsModule,
    PostsModule,
    PasswordResetsModule,
  ],
})
export class AppModule {}
