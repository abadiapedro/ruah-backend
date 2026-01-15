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
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../../config/multer.config';

@ApiTags('Products')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) { }

  /* =======================
     UPLOAD MULTIPLE IMAGES
  ======================= */
  @Post('upload-images')
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    return files.map(file => ({
      url: `/uploads/products/${file.filename}`,
    }));
  }

  /* =======================
     DELETE IMAGE FILE
  ======================= */
  @Delete('upload-image')
  deleteImage(@Body('url') url: string) {
    return this.service.deleteImageByUrl(url);
  }

  /* =======================
     CRUD
  ======================= */
  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('categoryId') categoryId?: string,
    @Query('bestSeller') bestSeller?: string,
    @Query('active') active?: string,
    @Query('search') search?: string,
    @Query('sort') sort = 'createdAt',
    @Query('order') order: 'ASC' | 'DESC' = 'DESC',
  ) {
    return this.service.findAllPaginated({
      page: Number(page),
      limit: Number(limit),
      categoryId: categoryId ? Number(categoryId) : undefined,
      bestSeller:
        bestSeller === undefined ? undefined : bestSeller === 'true',
      active:
        active === undefined ? undefined : active === 'true',
      search,
      sort,
      order,
    });
  }


  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Get(':id/related')
  findRelated(
    @Param('id', ParseIntPipe) id: number,
    @Query('categoryId') categoryId: string,
  ) {
    return this.service.findRelated(id, Number(categoryId), 4);
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
