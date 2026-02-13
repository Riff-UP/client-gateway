import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { envs } from "src/config";
import { USERS_SERVICE } from "src/config/services";
import { UserFollowsController } from "src/users/controllers";

@Module({
    controllers: [UserFollowsController],
    providers: [],
    imports: [
        ClientsModule.register([
            {
                name: USERS_SERVICE,
                transport: Transport.TCP,
                options: {
                    host: envs.usersMsHost,
                    port: envs.usersMsPort
                }
            }
        ])
    ]
})
export class UserFollowsModule {}