import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PostsModule } from './content/modules/posts/posts.module.js';
import { EventsModule } from './content/modules/events/events.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    NotificationsModule,
    EventsModule,
    PostsModule,
  ],
})
export class AppModule {}
