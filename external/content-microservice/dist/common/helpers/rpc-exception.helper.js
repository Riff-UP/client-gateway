"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RpcExceptionHelper = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
class RpcExceptionHelper {
    static notFound(resource, id) {
        throw new microservices_1.RpcException({
            statusCode: common_1.HttpStatus.NOT_FOUND,
            code: 'NOT_FOUND',
            message: id
                ? `${resource} with id ${id} not found`
                : `${resource} not found`,
        });
    }
    static conflict(message) {
        throw new microservices_1.RpcException({
            statusCode: common_1.HttpStatus.CONFLICT,
            code: 'CONFLICT',
            message,
        });
    }
    static badRequest(message) {
        throw new microservices_1.RpcException({
            statusCode: common_1.HttpStatus.BAD_REQUEST,
            code: 'BAD_REQUEST',
            message,
        });
    }
    static unauthorized(message = 'Unauthorized') {
        throw new microservices_1.RpcException({
            statusCode: common_1.HttpStatus.UNAUTHORIZED,
            code: 'UNAUTHORIZED',
            message,
        });
    }
    static internal(message = 'Internal server error') {
        throw new microservices_1.RpcException({
            statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            code: 'INTERNAL_SERVER_ERROR',
            message,
        });
    }
}
exports.RpcExceptionHelper = RpcExceptionHelper;
//# sourceMappingURL=rpc-exception.helper.js.map