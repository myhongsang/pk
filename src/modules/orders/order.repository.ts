import { Injectable } from '@nestjs/common';
import { Order, Payment, Prisma, Product } from '@prisma/client';

import { SORT_ORDER_DESC } from '@app/constants/sort.constants';
import { PrismaService } from '@app/prisma/prisma.service';
import {
  createPaginatedResult,
  type PaginatedResult,
} from '@app/common/dto/pagination.dto';
import { CreateOrderDto } from '@app/modules/orders/dto/create-order.dto';
import type { OrderItemCreateInput } from '@app/modules/orders/dto/create-order.dto';
import type { CreatePaymentDto } from '@app/modules/orders/dto/create-payment.dto';
import type { OrderQueryDto } from '@app/modules/orders/dto/order-query.dto';
import { StatisticsQueryDto } from '@app/modules/orders/dto/statistics-query.dto';
import { UpdateOrderDto } from '@app/modules/orders/dto/update-order.dto';

const orderInclude = {
  items: { include: { product: true } },
  payments: true,
  user: { select: { id: true, name: true, email: true } },
} satisfies Prisma.OrderInclude;

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  findProductsByIds(ids: string[]): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { id: { in: ids } },
    });
  }

  async findAll({
    page,
    limit,
    status,
  }: OrderQueryDto): Promise<PaginatedResult<Order>> {
    const where: Prisma.OrderWhereInput | undefined = status
      ? { status }
      : undefined;

    const [orders, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        orderBy: { createdAt: SORT_ORDER_DESC },
        skip: (page - 1) * limit,
        take: limit,
        include: orderInclude,
      }),
      this.prisma.order.count({ where }),
    ]);

    return createPaginatedResult(orders, total, { page, limit });
  }

  findById(id: string): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id },
      include: orderInclude,
    });
  }

  create(
    data: Omit<CreateOrderDto, 'items'>,
    items: OrderItemCreateInput[],
    total: number,
  ): Promise<Order> {
    return this.prisma.order.create({
      data: {
        userId: data.userId,
        status: data.status,
        total,
        items: { create: items },
      },
      include: orderInclude,
    });
  }

  updateStatus(id: string, status: UpdateOrderDto['status']): Promise<Order> {
    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.order.delete({ where: { id } });
  }

  createPayment(
    orderId: string,
    amount: number,
    status: CreatePaymentDto['status'],
  ): Promise<Payment> {
    return this.prisma.payment.create({
      data: {
        orderId,
        amount,
        status,
        paidAt: status === 'PAID' ? new Date() : null,
      },
    });
  }

  buildWhere(query: StatisticsQueryDto): Prisma.OrderWhereInput {
    const where: Prisma.OrderWhereInput = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.from || query.to) {
      where.createdAt = {};

      if (query.from) {
        where.createdAt.gte = query.from;
      }

      if (query.to) {
        where.createdAt.lte = query.to;
      }
    }

    return where;
  }

  countOrders(where: Prisma.OrderWhereInput): Promise<number> {
    return this.prisma.order.count({ where });
  }

  async sumOrderTotal(where: Prisma.OrderWhereInput): Promise<number> {
    const result = await this.prisma.order.aggregate({
      where,
      _sum: { total: true },
    });

    return result._sum.total ?? 0;
  }

  async sumPaid(where: Prisma.OrderWhereInput): Promise<number> {
    const result = await this.prisma.payment.aggregate({
      where: {
        status: 'PAID',
        order: where,
      },
      _sum: { amount: true },
    });

    return result._sum.amount ?? 0;
  }
}
