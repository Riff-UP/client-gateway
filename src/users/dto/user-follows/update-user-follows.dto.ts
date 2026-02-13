import { PartialType } from "@nestjs/mapped-types";
import { CreateUFDto } from "./create-user-follows.dto";

export class UpdateUFDto extends PartialType(CreateUFDto) {}