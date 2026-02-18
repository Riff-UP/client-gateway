import { PartialType } from '@nestjs/mapped-types';
import { CreateSMDto } from './create-social-media.dto';

export class UpdateSMDto extends PartialType(CreateSMDto) {}
