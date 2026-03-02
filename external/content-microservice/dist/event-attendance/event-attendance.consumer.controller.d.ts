import { UsersService } from '../users/users.service';
import { AuthTokenGeneratedDto } from '../posts/dto/generatedToken.dto';
export declare class EventAttendanceConsumerController {
    private readonly usersService;
    private readonly logger;
    constructor(usersService: UsersService);
    handleAuthToken(data: AuthTokenGeneratedDto): Promise<void>;
}
