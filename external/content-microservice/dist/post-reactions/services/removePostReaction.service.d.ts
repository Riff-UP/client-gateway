import { Model } from 'mongoose';
import { PostReactionDocument } from '../schemas/post-reactions.schema';
export declare class RemovePostReactionService {
    private readonly postReactionModel;
    private readonly logger;
    constructor(postReactionModel: Model<PostReactionDocument>);
    execute(id: string): Promise<PostReactionDocument>;
}
