import { BadRequestException, Injectable, NotFoundException,} from '@nestjs/common';
import { Product } from '@prisma/client';

import type { PaginatedResult,} from '@app/common/dto/pagination.dto';
import type { ProductQueryDto,} from '@app/modules/products/dto/product-query.dto';
import { CreateProductDto } from '@app/modules/products/dto/create-product.dto';
import { UpdateProductDto } from '@app/modules/products/dto/update-product.dto';
import { ProductRepository } from '@app/modules/products/product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  create(data: CreateProductDto): Promise<Product> {
    return this.productRepository.create(data);
  }

  findAll(
    categoryId: string | undefined,
    query: ProductQueryDto,
  ): Promise<PaginatedResult<Product>> {
    return this.productRepository.findAll(categoryId, query);
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async update(id: string, data: UpdateProductDto): Promise<Product> {
    await this.findOne(id);

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields to update');
    }

    return this.productRepository.update(id, data);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.productRepository.delete(id);
  }
}
