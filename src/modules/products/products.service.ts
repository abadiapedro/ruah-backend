import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Not } from 'typeorm';
import { Product } from './products.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) { }

  create(dto: CreateProductDto) {
    this.validateMainImage(dto.images);

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

  async findAllPaginated(params: {
    page: number;
    limit: number;
    categoryId?: number;
    bestSeller?: boolean;
    active?: boolean;
    search?: string;
    sort: string;
    order: 'ASC' | 'DESC';
  }) {
    const {
      page,
      limit,
      categoryId,
      bestSeller,
      active,
      search,
      sort,
      order,
    } = params;

    const qb = this.repository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'images')
      .orderBy(
        sort === 'price'
          ? 'product.price'
          : sort === 'name'
            ? 'product.name'
            : 'product.createdAt',
        order,
      )
      .skip((page - 1) * limit)
      .take(limit);

    if (categoryId) {
      qb.andWhere('category.id = :categoryId', { categoryId });
    }

    if (bestSeller !== undefined) {
      qb.andWhere('product.isBestSeller = :bestSeller', { bestSeller });
    }

    if (active !== undefined) {
      qb.andWhere('product.active = :active', { active });
    }

    if (search) {
      qb.andWhere('LOWER(product.name) LIKE :search', {
        search: `%${search.toLowerCase()}%`,
      });
    }

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
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

  async findOne(id: number) {
    const product = await this.repository.findOne({
      where: { id },
      relations: ['category', 'images'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  findRelated(productId: number, categoryId: number, limit = 4) {
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

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.findOne(id);

    if (dto.images) {
      this.validateMainImage(dto.images);
      product.images = dto.images as any;
    }

    if (dto.categoryId) {
      product.category = { id: dto.categoryId } as any;
    }

    Object.assign(product, dto);

    return this.repository.save(product);
  }

  async remove(id: number) {
    const product = await this.repository.findOne({
      where: { id },
      relations: ['images'],
    });

    if (!product) return;

    for (const image of product.images) {
      if (image.url?.startsWith('/uploads/')) {
        const filePath = join(
          process.cwd(),
          image.url.replace('/uploads/', 'uploads/'),
        );

        try {
          await unlink(filePath);
        } catch { }
      }
    }

    return this.repository.delete(id);
  }

  async deleteImageByUrl(url: string) {
    if (!url || !url.startsWith('/uploads/')) {
      throw new BadRequestException('Invalid image path');
    }

    const filePath = join(
      process.cwd(),
      url.replace('/uploads/', 'uploads/'),
    );

    try {
      await unlink(filePath);
      return { success: true };
    } catch {
      return { success: false };
    }
  }

  private validateMainImage(images: { isMain?: boolean }[]) {
    const mainImages = images.filter(img => img.isMain);

    if (mainImages.length > 1) {
      throw new BadRequestException(
        'Only one image can be marked as main',
      );
    }
  }
}
