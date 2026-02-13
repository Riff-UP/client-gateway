import { PartialType } from "@nestjs/mapped-types";
import { CreateUSDto } from "./create-user-stats.dto";

export class UpdateUSDto extends PartialType(CreateUSDto){}