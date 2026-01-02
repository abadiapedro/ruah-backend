import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateHomeHighlightDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

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
