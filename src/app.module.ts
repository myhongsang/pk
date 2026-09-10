import { Module } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { AuthModule } from '@app/modules/auth/auth.module';
import { PrismaModule } from '@app/prisma/prisma.module';
import { ProductModule } from '@app/modules/products/product.module';
import { UsersModule } from '@app/modules/users/users.module';
import { CategoriesModule } from '@app/modules/categories/categories.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ProductModule,
    UsersModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
