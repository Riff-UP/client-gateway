import { Model } from 'mongoose';
import { PostDocument } from '../schemas/post.schema';
import { UpdatePostDto } from '../dto/update-post.dto';
export declare class UpdatePostService {
    private readonly postModel;
    private readonly logger;
    constructor(postModel: Model<PostDocument>);
    execute(id: string, updatePostDto: UpdatePostDto): Promise<PostDocument>;
}
