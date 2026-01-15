import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './roles.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly repository: Repository<Role>,
  ) { }

  create(dto: CreateRoleDto) {
    return this.repository.save(dto);
  }

  async findAll(active?: boolean) {
    const where = active !== undefined ? { active } : {};

    const [items, total] = await this.repository.findAndCount({
      where,
      order: { name: 'ASC' },
    });

    return {
      items,
      total,
    };
  }

  findOne(id: number) {
    return this.repository.findOneBy({ id });
  }

  update(id: number, dto: UpdateRoleDto) {
    return this.repository.save({
      id,
      ...dto,
    });
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
