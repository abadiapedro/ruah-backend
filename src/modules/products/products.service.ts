import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './products.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindOptionsWhere } from 'typeorm';
import { Not } from 'typeorm';


@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) { }

  create(dto: CreateProductDto) {
    const product = this.repository.create({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      active: dto.active ?? true,
      isBestSeller: dto.isBestSeller ?? false,
      category: { id: dto.categoryId },
      images: dto.images,
    });

    return this.repository.save(product);
  }

  findAll(filters?: { categoryId?: number; bestSeller?: boolean }) {
    const where: FindOptionsWhere<Product> = {};

    if (filters?.categoryId) {
      where.category = { id: filters.categoryId };
    }

    if (filters?.bestSeller !== undefined) {
      where.isBestSeller = filters.bestSeller;
    }

    return this.repository.find({
      where,
      relations: ['category', 'images'],
      order: {
        images: { order: 'ASC' },
      },
    });
  }

  findOne(id: number) {
    return this.repository.findOne({
      where: { id },
      relations: ['category', 'images'],
    });
  }

  findRelated(
    productId: number,
    categoryId: number,
    limit = 4,
  ) {
    return this.repository.find({
      where: {
        category: { id: categoryId },
        id: Not(productId),
        active: true,
      },
      relations: ['category', 'images'],
      take: limit,
    });
  }

  update(id: number, dto: UpdateProductDto) {
    return this.repository.save({
      id,
      ...dto,
      category: dto.categoryId ? { id: dto.categoryId } : undefined,
    });
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
