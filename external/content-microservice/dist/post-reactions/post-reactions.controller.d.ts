import { CreatePostReactionDto } from './dto/create-post-reaction.dto';
import { CreatePostReactionService } from './services/createPostReaction.service';
import { FindReactionsByPostService } from './services/findReactionsByPost.service';
import { RemovePostReactionService } from './services/removePostReaction.service';
export declare class PostReactionsController {
    private readonly createPostReactionService;
    private readonly findReactionsByPostService;
    private readonly removePostReactionService;
    constructor(createPostReactionService: CreatePostReactionService, findReactionsByPostService: FindReactionsByPostService, removePostReactionService: RemovePostReactionService);
    create(dto: CreatePostReactionDto): Promise<{
        reaction: import("./schemas/post-reactions.schema").PostReactionDocument | null;
        action: "created" | "removed";
    }>;
    findByPost(payload: {
        post_id: string;
    }): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/post-reactions.schema").PostReaction, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/post-reactions.schema").PostReaction & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    remove(payload: {
        id: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/post-reactions.schema").PostReaction, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/post-reactions.schema").PostReaction & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
}
