import { PartialType } from '@nestjs/mapped-types';
import { CreatePRDto } from './create-password-reset.dto';

export class UpdatePRDto extends PartialType(CreatePRDto) {}
