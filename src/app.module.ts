import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module.js';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [UsersModule],
})
export class AppModule {}
