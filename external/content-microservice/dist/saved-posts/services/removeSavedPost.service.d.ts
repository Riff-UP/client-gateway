import { Model } from 'mongoose';
import { SavedPostDocument } from '../schemas/saved-post.schema';
export declare class RemoveSavedPostService {
    private readonly savedPostModel;
    private readonly logger;
    constructor(savedPostModel: Model<SavedPostDocument>);
    execute(id: string): Promise<SavedPostDocument>;
}
