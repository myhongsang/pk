import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards,} from '@nestjs/common';

import { JwtAuthGuard } from '@app/modules/auth/guards/jwt-auth.guard';
import { ROUTE_CATEGORIES } from '@app/constants/route.constants';
import { paginationQuerySchema, type PaginationQueryDto,} from '@app/common/dto/pagination.dto';
import { ZodValidationPipe } from '@app/utils/zod-validation.pipe';
import { createCategorySchema } from '@app/modules/categories/dto/create-category.dto';
import type { CreateCategoryDto } from '@app/modules/categories/dto/create-category.dto';
import { updateCategorySchema } from '@app/modules/categories/dto/update-category.dto';
import type { UpdateCategoryDto } from '@app/modules/categories/dto/update-category.dto';
import { CategoriesService } from '@app/modules/categories/categories.service';

@Controller(ROUTE_CATEGORIES)
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createCategorySchema)) dto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(dto);
  }

  @Get()
  findAll(
    @Query(new ZodValidationPipe(paginationQuerySchema))
    pagination: PaginationQueryDto,
  ) {
    return this.categoriesService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateCategorySchema)) dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.categoriesService.remove(id);
  }
}
