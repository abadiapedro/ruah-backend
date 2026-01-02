import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Query } from '@nestjs/common';


@ApiTags('Products')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) { }

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @Query('categoryId') categoryId?: number,
    @Query('bestSeller') bestSeller?: string,
  ) {
    return this.service.findAll({
      categoryId: categoryId ? Number(categoryId) : undefined,
      bestSeller: bestSeller === 'true',
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Get(':id/related')
  findRelated(
    @Param('id', ParseIntPipe) id: number,
    @Query('categoryId') categoryId: number,
  ) {
    return this.service.findRelated(
      id,
      Number(categoryId),
      4,
    );
  }


  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
