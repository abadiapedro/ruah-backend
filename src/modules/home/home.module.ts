import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { HomeBanner } from './home-banner.entity';
import { HomeHighlight } from './home-highlight.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HomeBanner, HomeHighlight])],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule { }
