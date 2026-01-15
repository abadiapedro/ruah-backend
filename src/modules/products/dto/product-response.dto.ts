import { ProductImageResponseDto } from './product-image-response.dto';

export class ProductResponseDto {
  id: number;
  name: string;
  description: string;
  price: number | string;
  active: boolean;
  isBestSeller: boolean;
  category: {
    id: number;
    name: string;
  };
  images: ProductImageResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}
