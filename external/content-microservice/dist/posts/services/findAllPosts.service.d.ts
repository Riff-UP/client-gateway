import { Model } from 'mongoose';
import { PostDocument } from '../schemas/post.schema';
import { PaginationDto, PaginatedResult } from '../../common';
export declare class FindAllPostsService {
    private readonly postModel;
    private readonly logger;
    constructor(postModel: Model<PostDocument>);
    execute(pagination?: PaginationDto): Promise<PaginatedResult<PostDocument>>;
    byUser(sqlUserId: string): Promise<PostDocument[]>;
}
