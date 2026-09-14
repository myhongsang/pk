import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards,} from '@nestjs/common';

import { JwtAuthGuard } from '@app/modules/auth/guards/jwt-auth.guard';
import { ROUTE_PRODUCTS } from '@app/constants/route.constants';
import { ZodValidationPipe } from '@app/utils/zod-validation.pipe';
import { createProductSchema } from '@app/modules/products/dto/create-product.dto';
import type { CreateProductDto } from '@app/modules/products/dto/create-product.dto';
import { updateProductSchema } from '@app/modules/products/dto/update-product.dto';
import type { UpdateProductDto } from '@app/modules/products/dto/update-product.dto';
import { ProductService } from '@app/modules/products/product.service';

@Controller(ROUTE_PRODUCTS)
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createProductSchema)) dto: CreateProductDto,
  ) {
    return this.productService.create(dto);
  }

  @Get()
  findAll(@Query('categoryId') categoryId?: string) {
    return this.productService.findAll(categoryId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateProductSchema)) dto: UpdateProductDto,
  ) {
    return this.productService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.productService.remove(id);
  }
}
