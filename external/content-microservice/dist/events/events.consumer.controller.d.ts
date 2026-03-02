import { CreateEventService } from './services/createEvent.service';
import { UsersService } from '../users/users.service';
import { AuthTokenGeneratedDto } from '../posts/dto/generatedToken.dto';
export declare class EventsConsumerController {
    private readonly createEventService;
    private readonly usersService;
    private readonly logger;
    constructor(createEventService: CreateEventService, usersService: UsersService);
    handleAuthToken(data: AuthTokenGeneratedDto): Promise<void>;
}
