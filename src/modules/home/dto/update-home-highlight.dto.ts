import { PartialType } from '@nestjs/mapped-types';
import { CreateHomeHighlightDto } from './create-home-highlight.dto';

export class UpdateHomeHighlightDto extends PartialType(CreateHomeHighlightDto) {}
