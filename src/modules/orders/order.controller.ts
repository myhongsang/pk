import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '@app/modules/auth/guards/jwt-auth.guard';
import {
  ROUTE_ORDERS,
  ROUTE_ORDERS_PAYMENTS,
  ROUTE_ORDERS_STATISTICS,
} from '@app/constants/route.constants';
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
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body(new ZodValidationPipe(createOrderSchema)) dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  @Get(ROUTE_ORDERS_STATISTICS)
  getStatistics(
    @Query(new ZodValidationPipe(statisticsQuerySchema))
    query: StatisticsQueryDto,
  ) {
    return this.orderService.getStatistics(query);
  }

  @Get()
  findAll(
    @Query(new ZodValidationPipe(orderQuerySchema)) query: OrderQueryDto,
  ) {
    return this.orderService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.findOne(id);
  }

  @Post(`:id/${ROUTE_ORDERS_PAYMENTS}`)
  addPayment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(createPaymentSchema)) dto: CreatePaymentDto,
  ) {
    return this.orderService.addPayment(id, dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateOrderSchema)) dto: UpdateOrderDto,
  ) {
    return this.orderService.updateStatus(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.orderService.remove(id);
  }
}
