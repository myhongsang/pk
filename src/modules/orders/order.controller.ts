import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards,} from '@nestjs/common';

import { JwtAuthGuard } from '@app/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@app/modules/auth/guards/roles.guard';
import { Roles } from '@app/modules/auth/decorators/roles.decorator';
import { ROLE_ADMIN, ROLE_EMPLOYEE } from '@app/constants/role.constants';
import { ROUTE_ORDERS, ROUTE_ORDERS_PAYMENTS, ROUTE_ORDERS_STATISTICS,} from '@app/constants/route.constants';
import { ZodValidationPipe } from '@app/utils/zod-validation.pipe';
import { createOrderSchema } from '@app/modules/orders/dto/create-order.dto';
import type { CreateOrderDto } from '@app/modules/orders/dto/create-order.dto';
import { createPaymentSchema } from '@app/modules/orders/dto/create-payment.dto';
import type { CreatePaymentDto } from '@app/modules/orders/dto/create-payment.dto';
import { orderQuerySchema } from '@app/modules/orders/dto/order-query.dto';
import type { OrderQueryDto } from '@app/modules/orders/dto/order-query.dto';
import { statisticsQuerySchema } from '@app/modules/orders/dto/statistics-query.dto';
import type { StatisticsQueryDto } from '@app/modules/orders/dto/statistics-query.dto';
import { updateOrderSchema } from '@app/modules/orders/dto/update-order.dto';
import type { UpdateOrderDto } from '@app/modules/orders/dto/update-order.dto';
import { OrderService } from '@app/modules/orders/order.service';

@Controller(ROUTE_ORDERS)
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles(ROLE_ADMIN, ROLE_EMPLOYEE)
  create(@Body(new ZodValidationPipe(createOrderSchema)) dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  @Get(ROUTE_ORDERS_STATISTICS)
  @Roles(ROLE_ADMIN, ROLE_EMPLOYEE)
  getStatistics(
    @Query(new ZodValidationPipe(statisticsQuerySchema))
    query: StatisticsQueryDto,
  ) {
    return this.orderService.getStatistics(query);
  }

  @Get()
  @Roles(ROLE_ADMIN, ROLE_EMPLOYEE)
  findAll(
    @Query(new ZodValidationPipe(orderQuerySchema)) query: OrderQueryDto,
  ) {
    return this.orderService.findAll(query);
  }

  @Get(':id')
  @Roles(ROLE_ADMIN, ROLE_EMPLOYEE)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.findOne(id);
  }

  @Post(`:id/${ROUTE_ORDERS_PAYMENTS}`)
  @Roles(ROLE_ADMIN, ROLE_EMPLOYEE)
  addPayment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(createPaymentSchema)) dto: CreatePaymentDto,
  ) {
    return this.orderService.addPayment(id, dto);
  }

  @Patch(':id')
  @Roles(ROLE_ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateOrderSchema)) dto: UpdateOrderDto,
  ) {
    return this.orderService.updateStatus(id, dto);
  }

  @Delete(':id')
  @Roles(ROLE_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.orderService.remove(id);
  }
}
