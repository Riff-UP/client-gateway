import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { Post } from '../schemas/post.schema';
import { CreatePostDto } from '../dto/create-post.dto';
import { UploadService } from '../../utils/services/upload.service';
import { StorageService } from '../../utils/services/storage.service';
export declare class createPostService implements OnModuleInit {
    private readonly postModel;
    private readonly uploadService;
    private readonly storageService;
    private readonly logger;
    private readonly client;
    constructor(postModel: Model<Post>, uploadService: UploadService, storageService: StorageService);
    onModuleInit(): void;
    create(createPostDto: CreatePostDto, auth?: {
        _token?: string;
    }): Promise<(import("mongoose").Document<unknown, {}, Post, {}, import("mongoose").DefaultSchemaOptions> & Post & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | undefined>;
}
