"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const microservices_1 = require("@nestjs/microservices");
const post_schema_1 = require("../schemas/post.schema");
const envs_1 = require("../../config/envs");
const upload_service_1 = require("../../utils/services/upload.service");
const storage_service_1 = require("../../utils/services/storage.service");
const resolveSoundCloud_1 = require("./helpers/resolveSoundCloud");
const isImageUrl_1 = require("./helpers/isImageUrl");
const saveImageToR2_1 = require("./helpers/saveImageToR2");
const common_2 = require("../../common");
let createPostService = class createPostService {
    postModel;
    uploadService;
    storageService;
    logger = new common_1.Logger('PostCreationService');
    client;
    constructor(postModel, uploadService, storageService) {
        this.postModel = postModel;
        this.uploadService = uploadService;
        this.storageService = storageService;
        this.client = microservices_1.ClientProxyFactory.create({
            transport: microservices_1.Transport.RMQ,
            options: {
                urls: [envs_1.envs.rabbitUrl],
                queue: 'riff_queue',
                queueOptions: { durable: true },
            },
        });
    }
    onModuleInit() {
        this.logger.log('PostCreationService initialized');
    }
    async create(createPostDto, auth) {
        const normalized = this.uploadService.normalizePostPayload(createPostDto);
        const contentUrl = normalized.content ?? '';
        if (!auth || !auth._token) {
            common_2.RpcExceptionHelper.badRequest('Auth token is required to create a post');
            return;
        }
        if (normalized.provider &&
            normalized.provider.toLowerCase() === 'soundcloud') {
            const resolved = await (0, resolveSoundCloud_1.resolveSoundCloud)(contentUrl);
            normalized.type = 'audio';
            normalized.provider = 'soundcloud';
            normalized.content = resolved.media_url;
        }
        else {
            if (!contentUrl) {
                common_2.RpcExceptionHelper.badRequest('Image URL is required');
            }
            if (!(0, isImageUrl_1.isImageUrl)(contentUrl)) {
                common_2.RpcExceptionHelper.badRequest('Provided URL does not look like an image');
            }
            normalized.type = 'image';
            const publicUrl = await (0, saveImageToR2_1.saveImageToR2)(normalized.content ?? '', this.storageService, auth._token);
            normalized.content = publicUrl;
        }
        const post = await this.postModel.create(normalized);
        this.client.emit('post.created', {
            type: 'new_post',
            message: `New post: ${normalized.title}`,
            userId: normalized.sql_user_id,
            postId: String(post._id),
        });
        this.logger.log(`Post created: ${String(post._id)}`);
        return post;
    }
};
exports.createPostService = createPostService;
exports.createPostService = createPostService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(post_schema_1.Post.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        upload_service_1.UploadService,
        storage_service_1.StorageService])
], createPostService);
//# sourceMappingURL=createPost.service.js.map