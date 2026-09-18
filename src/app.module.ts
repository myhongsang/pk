import { Module } from '@nestjs/common';

import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { AuthModule } from '@app/modules/auth/auth.module';
import { CategoriesModule } from '@app/modules/categories/categories.module';
import { OrderModule } from '@app/modules/orders/order.module';
import { ProductModule } from '@app/modules/products/product.module';
import { PrismaModule } from '@app/prisma/prisma.module';
import { UsersModule } from '@app/modules/users/users.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ProductModule,
    UsersModule,
    CategoriesModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
