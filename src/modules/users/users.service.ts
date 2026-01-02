import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  /**
   * CREATE
   * - Criptografa a senha
   * - Associa Role corretamente
   */
  async create(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.repository.save({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      active: dto.active ?? true,
      role: { id: dto.roleId },
    });
  }

  /**
   * READ - List
   */
  findAll() {
    return this.repository.find({
      relations: ['role'],
    });
  }

  /**
   * READ - By ID
   */
  findOne(id: number) {
    return this.repository.findOne({
      where: { id },
      relations: ['role'],
    });
  }

  /**
   * READ - By Email (OBRIGATÓRIO para Auth)
   */
  findByEmail(email: string) {
    return this.repository.findOne({
      where: { email },
      relations: ['role'],
    });
  }

  /**
   * UPDATE
   * - NÃO regrava senha se não vier no DTO
   */
  async update(id: number, dto: UpdateUserDto) {
    const updateData: any = {
      id,
      name: dto.name,
      email: dto.email,
      active: dto.active,
    };

    if (dto.roleId) {
      updateData.role = { id: dto.roleId };
    }

    // ⚠️ Se futuramente permitir trocar senha
    if (dto.password) {
      updateData.password = await bcrypt.hash(dto.password, 10);
    }

    return this.repository.save(updateData);
  }

  /**
   * DELETE
   */
  remove(id: number) {
    return this.repository.delete(id);
  }
}
