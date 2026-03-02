import { CreateSavedPostService } from './services/createSavedPost.service';
import { UsersService } from '../users/users.service';
import { AuthTokenGeneratedDto } from '../posts/dto/generatedToken.dto';
export declare class SavedPostsConsumerController {
    private readonly createSavedPostService;
    private readonly usersService;
    private readonly logger;
    constructor(createSavedPostService: CreateSavedPostService, usersService: UsersService);
    handleAuthToken(data: AuthTokenGeneratedDto): Promise<void>;
}
