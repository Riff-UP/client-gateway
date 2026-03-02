import { Model } from 'mongoose';
import { PostReactionDocument } from '../schemas/post-reactions.schema';
export declare class FindReactionsByPostService {
    private readonly postReactionModel;
    private readonly logger;
    constructor(postReactionModel: Model<PostReactionDocument>);
    execute(postId: string): Promise<PostReactionDocument[]>;
}
