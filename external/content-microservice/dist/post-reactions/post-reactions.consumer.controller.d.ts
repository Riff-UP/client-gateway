import { CreatePostReactionService } from './services/createPostReaction.service';
import { UsersService } from '../users/users.service';
import { AuthTokenGeneratedDto } from '../posts/dto/generatedToken.dto';
export declare class PostReactionsConsumerController {
    private readonly createPostReactionService;
    private readonly usersService;
    private readonly logger;
    constructor(createPostReactionService: CreatePostReactionService, usersService: UsersService);
    handleAuthToken(data: AuthTokenGeneratedDto): Promise<void>;
}
