import { Module } from '@nestjs/common';

import { AuthModule } from '@app/modules/auth/auth.module';
import { OrderController } from '@app/modules/orders/order.controller';
import { OrderRepository } from '@app/modules/orders/order.repository';
import { OrderService } from '@app/modules/orders/order.service';
import { PrismaModule } from '@app/prisma/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
})
export class OrderModule {}
