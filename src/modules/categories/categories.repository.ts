import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';

import { SORT_ORDER_ASC } from '@app/constants/sort.constants';
import { PrismaService } from '@app/prisma/prisma.service';
import { CreateCategoryDto } from '@app/modules/categories/dto/create-category.dto';
import { UpdateCategoryDto } from '@app/modules/categories/dto/update-category.dto';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateCategoryDto): Promise<Category> {
    return this.prisma.category.create({ data });
  }

  findAll(): Promise<Category[]> {
    return this.prisma.category.findMany({
      orderBy: { id: SORT_ORDER_ASC },
    });
  }

  findById(id: string): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  update(id: string, data: UpdateCategoryDto): Promise<Category> {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({ where: { id } });
  }
}
