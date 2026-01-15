import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Categories')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  /* =======================
     CREATE
  ======================= */
  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.service.create(dto);
  }

  /* =======================
     LIST (PAGINATION + FILTERS)
  ======================= */
  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
    @Query('active') active?: string,
    @Query('sort') sort: 'name' | 'createdAt' = 'createdAt',
    @Query('order') order: 'ASC' | 'DESC' = 'DESC',
  ) {
    return this.service.findAllPaginated({
      page: Number(page),
      limit: Number(limit),
      search,
      active:
        active === undefined ? undefined : active === 'true',
      sort,
      order,
    });
  }

  /* =======================
     FIND ONE
  ======================= */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  /* =======================
     UPDATE
  ======================= */
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.service.update(id, dto);
  }

  /* =======================
     DELETE ONE
  ======================= */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  /* =======================
     BULK DELETE
  ======================= */
  @Delete()
  removeMany(@Body('ids') ids: number[]) {
    if (!ids || !ids.length) {
      throw new BadRequestException('Ids array is required');
    }

    return this.service.removeMany(ids);
  }
}
