import { Model } from 'mongoose';
import { PostReactionDocument } from '../schemas/post-reactions.schema';
import { CreatePostReactionDto } from '../dto/create-post-reaction.dto';
export declare class CreatePostReactionService {
    private readonly postReactionModel;
    private readonly logger;
    constructor(postReactionModel: Model<PostReactionDocument>);
    execute(dto: CreatePostReactionDto): Promise<{
        reaction: PostReactionDocument | null;
        action: 'created' | 'removed';
    }>;
}
