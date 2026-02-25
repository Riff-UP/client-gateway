import { Module } from '@nestjs/common';
import { PostsController } from '../../controllers';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CONTENT_SERVICE } from '../../../config/services.js';
import { envs } from '../../../config/index.js';

@Module({
  controllers: [PostsController],
  imports: [
    ClientsModule.register([
      {
        name: CONTENT_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.contentMsHost,
          port: envs.contentMsPort,
        },
      },
    ]),
  ],
})
export class PostsModule {}
