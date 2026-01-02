import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateHomeBannerDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  imageUrl: string;

  @IsString()
  @IsOptional()
  linkUrl?: string;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
