import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './categories.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
  ) {}

  /* =======================
     CREATE
  ======================= */
  create(dto: CreateCategoryDto) {
    const category = this.repository.create({
      name: dto.name,
      active: dto.active ?? true,
    });

    return this.repository.save(category);
  }

  /* =======================
     LIST (PAGINATED)
  ======================= */
  async findAllPaginated(params: {
    page: number;
    limit: number;
    search?: string;
    active?: boolean;
    sort: 'name' | 'createdAt';
    order: 'ASC' | 'DESC';
  }) {
    const { page, limit, search, active, sort, order } = params;

    const qb = this.repository.createQueryBuilder('category');

    if (search) {
      qb.andWhere('LOWER(category.name) LIKE :search', {
        search: `%${search.toLowerCase()}%`,
      });
    }

    if (active !== undefined) {
      qb.andWhere('category.active = :active', { active });
    }

    const sortColumn =
      sort === 'name'
        ? 'category.name'
        : 'category.createdAt';

    qb.orderBy(sortColumn, order)
      .skip((page - 1) * limit)
      .take(limit);

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

  /* =======================
     FIND ONE
  ======================= */
  async findOne(id: number) {
    const category = await this.repository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  /* =======================
     UPDATE
  ======================= */
  async update(id: number, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    Object.assign(category, dto);

    return this.repository.save(category);
  }

  /* =======================
     DELETE ONE
  ======================= */
  async remove(id: number) {
    return this.repository.delete(id);
  }

  /* =======================
     BULK DELETE
  ======================= */
  async removeMany(ids: number[]) {
    return this.repository.delete(ids);
  }
}
