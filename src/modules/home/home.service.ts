import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHomeBannerDto } from './dto/create-home-banner.dto';
import { CreateHomeHighlightDto } from './dto/create-home-highlight.dto';
import { HomeBanner } from './home-banner.entity';
import { HomeHighlight } from './home-highlight.entity';
import { UpdateHomeBannerDto } from './dto/update-home-banner.dto';
import { UpdateHomeHighlightDto } from './dto/update-home-highlight.dto';

@Injectable()
export class HomeService {
    constructor(
        @InjectRepository(HomeBanner)
        private bannerRepo: Repository<HomeBanner>,
        @InjectRepository(HomeHighlight)
        private highlightRepo: Repository<HomeHighlight>,
    ) { }

    async findHome() {
        const banners = await this.bannerRepo.find({
            where: { active: true },
            order: { order: 'ASC' },
        });

        const highlights = await this.highlightRepo.find({
            where: { active: true },
            order: { order: 'ASC' },
        });

        return {
            banners,
            highlights,
        };
    }


    // ADMIN
    createBanner(dto: CreateHomeBannerDto) {
        return this.bannerRepo.save(dto);
    }

    createHighlight(dto: CreateHomeHighlightDto) {
        return this.highlightRepo.save(dto);
    }

    updateBanner(id: number, dto: UpdateHomeBannerDto) {
        return this.bannerRepo.save({
            id,
            ...dto,
        });
    }

    updateHighlight(id: number, dto: UpdateHomeHighlightDto) {
        return this.highlightRepo.save({
            id,
            ...dto,
        });
    }

}
