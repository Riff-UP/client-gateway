import { CreateEventReviewDto } from './dto/create-event-review.dto';
import { CreateEventReviewService } from './services/createEventReview.service';
import { UsersService } from '../users/users.service';
import { AuthTokenGeneratedDto } from '../posts/dto/generatedToken.dto';
export declare class EventReviewsConsumerController {
    private readonly createEventReviewService;
    private readonly usersService;
    private readonly logger;
    constructor(createEventReviewService: CreateEventReviewService, usersService: UsersService);
    handleAuthToken(data: AuthTokenGeneratedDto): Promise<void>;
    handleReviewCreated(payload: CreateEventReviewDto): Promise<void>;
}
