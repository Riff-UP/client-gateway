import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from '../../../config/index.js';
import { USERS_SERVICE } from '../../../config/services.js';
import { UserStatsController } from '../../controllers/index.js';

@Module({
  controllers: [UserStatsController],
  providers: [],
  imports: [
    ClientsModule.register([
      {
        name: USERS_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.usersMsHost,
          port: envs.usersMsPort,
        },
      },
    ]),
  ],
})
export class UserStatsModule {}
