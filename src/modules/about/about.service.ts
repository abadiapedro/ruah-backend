import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AboutContent } from './about.entity';
import { CreateAboutDto } from './dto/create-about.dto';
import { UpdateAboutDto } from './dto/update-about.dto';

@Injectable()
export class AboutService {
    constructor(
        @InjectRepository(AboutContent)
        private readonly repository: Repository<AboutContent>,
    ) { }

    async create(dto: CreateAboutDto) {
        if (dto.active) {
            await this.repository.update({ active: true }, { active: false });
        }

        return this.repository.save(dto);
    }

    findActive() {
        return this.repository.findOne({
            where: { active: true },
        });
    }

    findHome() {
        return this.repository.findOne({
            select: ['title', 'shortText', 'imageUrl'],
            where: { active: true },
        });
    }

    update(id: number, dto: UpdateAboutDto) {
        return this.repository.save({ id, ...dto });
    }
}
