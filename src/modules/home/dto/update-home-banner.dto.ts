import { PartialType } from '@nestjs/mapped-types';
import { CreateHomeBannerDto } from './create-home-banner.dto';

export class UpdateHomeBannerDto extends PartialType(CreateHomeBannerDto) {}
