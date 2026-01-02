import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './products.entity';
import { ProductImage } from './product-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductImage])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
