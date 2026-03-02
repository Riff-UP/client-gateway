import { CreateSavedPostDto } from './dto/create-saved-post.dto';
import { CreateSavedPostService } from './services/createSavedPost.service';
import { FindSavedPostsByUserService } from './services/findSavedPostsByUser.service';
import { RemoveSavedPostService } from './services/removeSavedPost.service';
export declare class SavedPostsController {
    private readonly createSavedPostService;
    private readonly findSavedPostsByUserService;
    private readonly removeSavedPostService;
    constructor(createSavedPostService: CreateSavedPostService, findSavedPostsByUserService: FindSavedPostsByUserService, removeSavedPostService: RemoveSavedPostService);
    create(dto: CreateSavedPostDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/saved-post.schema").SavedPost, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/saved-post.schema").SavedPost & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    findByUser(payload: {
        sql_user_id: string;
    }): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/saved-post.schema").SavedPost, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/saved-post.schema").SavedPost & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    remove(payload: {
        id: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/saved-post.schema").SavedPost, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/saved-post.schema").SavedPost & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
}
