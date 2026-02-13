import { PartialType } from "@nestjs/mapped-types";
import { CreateEventReviewsDto } from "./create-event-reviews.dto";

export class UpdateEventReviewsDto extends PartialType(CreateEventReviewsDto) {}