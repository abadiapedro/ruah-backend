import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateHomeBannerDto } from './dto/create-home-banner.dto';
import { CreateHomeHighlightDto } from './dto/create-home-highlight.dto';
import { HomeService } from './home.service';
import { UpdateHomeBannerDto } from './dto/update-home-banner.dto';
import { UpdateHomeHighlightDto } from './dto/update-home-highlight.dto';

@ApiTags('Home')
@Controller('home')

export class HomeController {
    constructor(private readonly service: HomeService) { }

    // FRONTEND
    @Get()
    getHome() {
        return this.service.findHome();
    }

    // ADMIN
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    @Post('banners')
    createBanner(@Body() dto: CreateHomeBannerDto) {
        return this.service.createBanner(dto);
    }

    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    @Post('highlights')
    createHighlight(@Body() dto: CreateHomeHighlightDto) {
        return this.service.createHighlight(dto);
    }
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    @Put('banners/:id')
    updateBanner(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateHomeBannerDto,
    ) {
        return this.service.updateBanner(id, dto);
    }

    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    @Put('highlights/:id')
    updateHighlight(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateHomeHighlightDto,
    ) {
        return this.service.updateHighlight(id, dto);
    }

}
