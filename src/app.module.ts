import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PostsModule, SavedPostsModule } from './content/modules';
import { EventsModule } from './content/modules';
import { EventAttendanceModule } from './content/modules';
import { EventReviewsModule } from './content/modules';
import { PostReactionsModule } from './content/modules';

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
    SavedPostsModule,
    PostsModule,
  ],
})
export class AppModule {}
