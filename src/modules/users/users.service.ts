import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

import { User } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) { }

  /* =======================
     HELPERS
  ======================= */
  private removeFile(file?: string) {
    if (!file) return;

    const fullPath = path.join(
      process.cwd(),
      file.replace('/uploads', 'uploads'),
    );

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }

  /* =======================
     CREATE
  ======================= */
  async create(dto: CreateUserDto) {
    const rawPassword =
      dto.password && dto.password.trim() !== ''
        ? dto.password
        : 'Admin#123';

    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    return this.repository.save({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      active: dto.active ?? true,
      avatarUrl: dto.avatarUrl,
      passwordChanged: 0,
      role: { id: dto.roleId },
    });
  }

  /* =======================
     READ
  ======================= */
  async findAll(params: {
    page: number;
    limit: number;
    search?: string;
    active?: boolean;
  }) {
    const { page, limit, search, active } = params;

    const qb = this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role');

    if (search) {
      qb.andWhere(
        'user.name LIKE :search OR user.email LIKE :search',
        { search: `%${search}%` },
      );
    }

    if (active !== undefined) {
      qb.andWhere('user.active = :active', { active });
    }

    const [items, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

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

  findOne(id: number) {
    return this.repository.findOne({
      where: { id },
      relations: ['role'],
    });
  }

  findById(id: number) {
    return this.repository.findOne({
      where: { id },
      relations: ['role'],
    });
  }

  findByEmail(email: string) {
    return this.repository.findOne({
      where: { email },
      relations: ['role'],
    });
  }

  /* =======================
     UPDATE
  ======================= */
  async update(id: number, dto: UpdateUserDto) {
    const user = await this.repository.findOne({
      where: { id },
    });

    if (!user) return null;

    if (dto.avatarUrl && dto.avatarUrl !== user.avatarUrl) {
      this.removeFile(user.avatarUrl);
    }

    const updateData: Partial<User> = { id };

    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.email !== undefined) updateData.email = dto.email;
    if (dto.active !== undefined) updateData.active = dto.active;
    if (dto.avatarUrl !== undefined) updateData.avatarUrl = dto.avatarUrl;
    if (dto.passwordChanged !== undefined)
      updateData.passwordChanged = dto.passwordChanged;

    if (dto.roleId !== undefined) {
      updateData.role = { id: dto.roleId } as any;
    }

    if (dto.password && dto.password.trim() !== '') {
      updateData.password = await bcrypt.hash(dto.password, 10);
      updateData.passwordChanged = 1;
    }

    return this.repository.save(updateData);
  }

  async resetPassword(id: number) {
    const user = await this.repository.findOne({
      where: { id },
    });

    if (!user) return null;

    const defaultPassword = 'Admin#123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    user.password = hashedPassword;
    user.passwordChanged = 0;

    await this.repository.save(user);

    return {
      message: 'Senha resetada com sucesso',
    };
  }

  /* =======================
     DELETE
  ======================= */
  async remove(id: number) {
    const user = await this.repository.findOne({
      where: { id },
    });

    if (user?.avatarUrl) {
      this.removeFile(user.avatarUrl);
    }

    return this.repository.delete(id);
  }
}
