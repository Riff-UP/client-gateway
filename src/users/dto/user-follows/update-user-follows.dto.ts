import { PartialType } from '@nestjs/mapped-types';
import { CreateUFDto } from './create-user-follows.dto.js';

export class UpdateUFDto extends PartialType(CreateUFDto) {}
