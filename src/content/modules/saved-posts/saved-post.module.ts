import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from '../../../config/index.js';
import { CONTENT_SERVICE } from '../../../config/services.js';
import { SavedPostsController } from '../../controllers';

@Module({
  controllers: [SavedPostsController],
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
export class SavedPostsModule {}
