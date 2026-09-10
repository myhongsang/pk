import { BadRequestException, Injectable, NotFoundException,} from '@nestjs/common';
import { Category } from '@prisma/client';

import { CreateCategoryDto } from '@app/modules/categories/dto/create-category.dto';
import { UpdateCategoryDto } from '@app/modules/categories/dto/update-category.dto';
import { CategoriesRepository } from '@app/modules/categories/categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  create(data: CreateCategoryDto): Promise<Category> {
    return this.categoriesRepository.create(data);
  }

  findAll(): Promise<Category[]> {
    return this.categoriesRepository.findAll();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findById(id);

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return category;
  }

  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    await this.findOne(id);

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields to update');
    }

    return this.categoriesRepository.update(id, data);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.categoriesRepository.delete(id);
  }
}
