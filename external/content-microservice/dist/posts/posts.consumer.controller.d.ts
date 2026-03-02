import { AuthTokenGeneratedDto } from './dto/generatedToken.dto';
import { UsersService } from '../users/users.service';
export declare class postsConsumerController {
    private readonly usersService;
    private readonly logger;
    constructor(usersService: UsersService);
    handleAuthToken(data: AuthTokenGeneratedDto): Promise<void>;
}
