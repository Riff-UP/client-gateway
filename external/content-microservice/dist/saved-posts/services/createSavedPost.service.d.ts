import { Model } from 'mongoose';
import { SavedPostDocument } from '../schemas/saved-post.schema';
import { CreateSavedPostDto } from '../dto/create-saved-post.dto';
export declare class CreateSavedPostService {
    private readonly savedPostModel;
    private readonly logger;
    constructor(savedPostModel: Model<SavedPostDocument>);
    execute(dto: CreateSavedPostDto): Promise<SavedPostDocument>;
}
