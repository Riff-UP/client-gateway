import { Model } from 'mongoose';
import { SavedPostDocument } from '../schemas/saved-post.schema';
export declare class FindSavedPostsByUserService {
    private readonly savedPostModel;
    private readonly logger;
    constructor(savedPostModel: Model<SavedPostDocument>);
    execute(sqlUserId: string): Promise<SavedPostDocument[]>;
}
