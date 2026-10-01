import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards,} from '@nestjs/common';

import { JwtAuthGuard } from '@app/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@app/modules/auth/guards/roles.guard';
import { Roles } from '@app/modules/auth/decorators/roles.decorator';
import { ROLE_ADMIN, ROLE_EMPLOYEE } from '@app/constants/role.constants';
import { ROUTE_PRODUCTS } from '@app/constants/route.constants';
import { productQuerySchema, type ProductQueryDto,} from '@app/modules/products/dto/product-query.dto';
import { ZodValidationPipe } from '@app/utils/zod-validation.pipe';
import { createProductSchema } from '@app/modules/products/dto/create-product.dto';
import type { CreateProductDto } from '@app/modules/products/dto/create-product.dto';
import { updateProductSchema } from '@app/modules/products/dto/update-product.dto';
import type { UpdateProductDto } from '@app/modules/products/dto/update-product.dto';
import { ProductService } from '@app/modules/products/product.service';

@Controller(ROUTE_PRODUCTS)
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles(ROLE_ADMIN, ROLE_EMPLOYEE)
  create(
    @Body(new ZodValidationPipe(createProductSchema)) dto: CreateProductDto,
  ) {
    return this.productService.create(dto);
  }

  @Get()
  @Roles(ROLE_ADMIN, ROLE_EMPLOYEE)
  findAll(
    @Query('categoryId') categoryId?: string,
    @Query(new ZodValidationPipe(productQuerySchema))
    query?: ProductQueryDto,
  ) {
    return this.productService.findAll(categoryId, query!);
  }

  @Get(':id')
  @Roles(ROLE_ADMIN, ROLE_EMPLOYEE)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @Roles(ROLE_ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateProductSchema)) dto: UpdateProductDto,
  ) {
    return this.productService.update(id, dto);
  }

  @Delete(':id')
  @Roles(ROLE_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.productService.remove(id);
  }
}
