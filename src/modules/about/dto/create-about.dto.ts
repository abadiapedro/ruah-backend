import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateAboutDto {
  @IsString()
  title: string;

  @IsString()
  shortText: string;

  @IsString()
  fullText: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  videoUrl?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
