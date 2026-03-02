"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("../../common");
let UploadService = class UploadService {
    logger = new common_1.Logger('UploadService');
    validateProviderLink(provider, content) {
        if (!provider)
            return true;
        if (!content)
            common_2.RpcExceptionHelper.badRequest('Provider specified but content is missing');
        const url = content ?? '';
        switch ((provider || '').toLowerCase()) {
            case 'soundcloud':
                if (!/soundcloud\.com/.test(url)) {
                    this.logger.warn(`Invalid soundcloud url: ${url}`);
                    common_2.RpcExceptionHelper.badRequest('Invalid SoundCloud URL');
                }
                return true;
            default:
                this.logger.warn(`Unknown provider ${provider}, skipping provider-specific validation`);
                return true;
        }
    }
    normalizePostPayload(payload) {
        const dto = {
            sql_user_id: payload.sql_user_id,
            type: payload.type,
            title: payload.title,
            description: payload.description,
            provider: payload.provider,
            content: payload.content,
        };
        if (!dto.sql_user_id || !dto.type || !dto.title) {
            common_2.RpcExceptionHelper.badRequest('Missing required post fields');
        }
        if (dto.provider)
            this.validateProviderLink(dto.provider, dto.content);
        return dto;
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)()
], UploadService);
//# sourceMappingURL=upload.service.js.map