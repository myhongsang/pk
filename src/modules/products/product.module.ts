import { Module } from '@nestjs/common';

import { PrismaModule } from '@app/prisma/prisma.module';
import { AuthModule } from '@app/modules/auth/auth.module';
import { ProductController } from '@app/modules/products/product.controller';
import { ProductRepository } from '@app/modules/products/product.repository';
import { ProductService } from '@app/modules/products/product.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
})
export class ProductModule {}
