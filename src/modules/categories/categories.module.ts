import { Module } from '@nestjs/common';
import { PrismaModule } from '@app/prisma/prisma.module';
import { AuthModule } from '@app/modules/auth/auth.module';
import { CategoriesController } from '@app/modules/categories/categories.controller';
import { CategoriesRepository } from '@app/modules/categories/categories.repository';
import { CategoriesService } from '@app/modules/categories/categories.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository],
})
export class CategoriesModule {}
