import { createPostService } from './services/createPost.service';
import { FindAllPostsService } from './services/findAllPosts.service';
import { FindOnePostService } from './services/findOnePost.service';
import { UpdatePostService } from './services/updatePost.service';
import { RemovePostService } from './services/removePost.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UsersService } from '../users/users.service';
import { PaginationDto } from '../common';
export declare class PostsController {
    private readonly createPostService;
    private readonly findAllPostsService;
    private readonly findOnePostService;
    private readonly updatePostService;
    private readonly removePostService;
    private readonly usersService;
    private readonly logger;
    constructor(createPostService: createPostService, findAllPostsService: FindAllPostsService, findOnePostService: FindOnePostService, updatePostService: UpdatePostService, removePostService: RemovePostService, usersService: UsersService);
    create(createPostDto: CreatePostDto): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/post.schema").Post, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/post.schema").Post & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | undefined>;
    findAll(pagination: PaginationDto): Promise<import("../common").PaginatedResult<import("mongoose").Document<unknown, {}, import("./schemas/post.schema").Post, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/post.schema").Post & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/post.schema").Post, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/post.schema").Post & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    update(updatePostDto: UpdatePostDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/post.schema").Post, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/post.schema").Post & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/post.schema").Post, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/post.schema").Post & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
}
