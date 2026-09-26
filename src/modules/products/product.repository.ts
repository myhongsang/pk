import { Injectable } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';

import { PrismaService } from '@app/prisma/prisma.service';
import { SORT_ORDER_DESC } from '@app/constants/sort.constants';
import {
  STATUS_ACTIVE,
  STATUS_INACTIVE,
} from '@app/constants/status.constants';
import { createPaginatedResult, type PaginatedResult,} from '@app/common/dto/pagination.dto';
import type { ProductQueryDto,} from '@app/modules/products/dto/product-query.dto';
import { CreateProductDto } from '@app/modules/products/dto/create-product.dto';
import { UpdateProductDto } from '@app/modules/products/dto/update-product.dto';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({ data });
  }

  async findAll(
    categoryId: string | undefined,
    { page, limit, q, minPrice, maxPrice }: ProductQueryDto,
  ): Promise<PaginatedResult<Product>> {
    const where: Prisma.ProductWhereInput = {
      status: STATUS_ACTIVE,
      ...(categoryId ? { categoryId } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            price: {
              ...(minPrice !== undefined ? { gte: minPrice } : {}),
              ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
            },
          }
        : {}),
    };

    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        orderBy: { createdAt: SORT_ORDER_DESC },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return createPaginatedResult(products, total, { page, limit });
  }

  findById(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  update(id: string, data: UpdateProductDto): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  softDelete(id: string): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data: { status: STATUS_INACTIVE },
    });
  }
}
