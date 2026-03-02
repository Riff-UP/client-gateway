import { Model } from 'mongoose';
import { PostDocument } from '../schemas/post.schema';
export declare class FindOnePostService {
    private readonly postModel;
    private readonly logger;
    constructor(postModel: Model<PostDocument>);
    execute(id: string): Promise<PostDocument>;
}
