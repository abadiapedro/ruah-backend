import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ProductImageDto {
  @IsString()
  url: string;

  @IsBoolean()
  @IsOptional()
  isMain?: boolean;

  @IsNumber()
  @IsOptional()
  order?: number;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()
  categoryId: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsBoolean()
  @IsOptional()
  isBestSeller?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  images: ProductImageDto[];
}
