import { AppDataSource } from '../data-source';
import { HomeBanner } from '../modules/home/home-banner.entity';
import { HomeHighlight } from '../modules/home/home-highlight.entity';

export async function seedHome() {
    const bannerRepo = AppDataSource.getRepository(HomeBanner);
    const highlightRepo = AppDataSource.getRepository(HomeHighlight);

    if ((await bannerRepo.count()) === 0) {
        await bannerRepo.save({
            title: 'Coleção Destaque',
            subtitle: 'Conheça nossas joias',
            imageUrl: '/banner.jpg',
            order: 1,
            active: true,
        });
    }

    if ((await highlightRepo.count()) === 0) {
        await highlightRepo.save({
            title: 'Qualidade Premium',
            description: 'Joias com acabamento refinado',
            imageUrl: '/images/highlight-qualidade.jpg',
            linkUrl: '/catalogo',
            order: 1,
            active: true,
        });
    }
}
