import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { envs } from "src/config";
import { CONTENT_SERVICE } from "src/config/services";
import { EventAttendanceController } from "../../controllers";

@Module({
    controllers: [EventAttendanceController],
    imports: [
        ClientsModule.register([
            {
                name: CONTENT_SERVICE,
                transport: Transport.TCP,
                options: {
                    host: envs.contentMsHost,
                    port: envs.contentMsPort
                }
            }
        ])
    ]
})
export class EventAttendanceModule {}