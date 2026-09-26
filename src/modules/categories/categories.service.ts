import { BadRequestException, Injectable, NotFoundException,} from '@nestjs/common';
import { Category } from '@prisma/client';

import type { PaginatedResult, PaginationQueryDto,} from '@app/common/dto/pagination.dto';
import { STATUS_ACTIVE } from '@app/constants/status.constants';
import { CreateCategoryDto } from '@app/modules/categories/dto/create-category.dto';
import { UpdateCategoryDto } from '@app/modules/categories/dto/update-category.dto';
import { CategoriesRepository } from '@app/modules/categories/categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  create(data: CreateCategoryDto): Promise<Category> {
    return this.categoriesRepository.create(data);
  }

  findAll(
    pagination: PaginationQueryDto,
  ): Promise<PaginatedResult<Category>> {
    return this.categoriesRepository.findAll(pagination);
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findById(id);

    if (!category || category.status !== STATUS_ACTIVE) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return category;
  }

  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    const existingCategory = await this.categoriesRepository.findById(id);

    if (!existingCategory) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields to update');
    }

    return this.categoriesRepository.update(id, data);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.categoriesRepository.softDelete(id);
  }
}
