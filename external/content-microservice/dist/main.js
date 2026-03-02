"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const config_1 = require("./config");
const common_2 = require("./common");
async function bootstrap() {
    const logger = new common_1.Logger('Content-MS');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalFilters(new common_2.GlobalRpcExceptionFilter());
    app.useGlobalInterceptors(new common_2.RpcResponseInterceptor());
    app.connectMicroservice({
        transport: microservices_1.Transport.TCP,
        options: {
            host: config_1.envs.host,
            port: config_1.envs.tcpPort,
        },
    });
    app.connectMicroservice({
        transport: microservices_1.Transport.RMQ,
        options: {
            urls: [config_1.envs.rabbitUrl],
            queue: 'riff_queue',
            queueOptions: { durable: true },
        },
    });
    await app.startAllMicroservices();
    await app.listen(config_1.envs.port);
    logger.log(`Application is running on port ${config_1.envs.port}`);
    logger.log(`Servidor HTTP corriendo en el puerto ${config_1.envs.port}`);
    logger.log(`Microservicio TCP escuchando en el puerto ${config_1.envs.tcpPort}`);
}
void bootstrap();
//# sourceMappingURL=main.js.map