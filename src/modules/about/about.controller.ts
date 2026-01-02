import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AboutService } from './about.service';
import { CreateAboutDto } from './dto/create-about.dto';
import { UpdateAboutDto } from './dto/update-about.dto';

@ApiTags('About')
@Controller('about')
export class AboutController {
  constructor(private readonly service: AboutService) {}

  // FRONTEND
  @Get()
  getAbout() {
    return this.service.findActive();
  }

  @Get('home')
  getHomeAbout() {
    return this.service.findHome();
  }

  // ADMIN
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateAboutDto) {
    return this.service.create(dto);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAboutDto) {
    return this.service.update(id, dto);
  }
}
