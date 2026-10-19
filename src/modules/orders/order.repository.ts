import { Injectable } from '@nestjs/common';
import { Order, Payment, Prisma, Product } from '@prisma/client';

import { PAYMENT_STATUS_PAID } from '@app/constants/order.constants';
import { SORT_ORDER_DESC } from '@app/constants/sort.constants';
import { STATUS_ACTIVE } from '@app/constants/status.constants';
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
      where: { id: { in: ids }, status: STATUS_ACTIVE },
    });
  }

  findActiveUserById(id: string): Promise<{ id: string } | null> {
    return this.prisma.user.findFirst({
      where: { id, status: STATUS_ACTIVE },
      select: { id: true },
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
        paidAt: status === PAYMENT_STATUS_PAID ? new Date() : null,
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
        status: PAYMENT_STATUS_PAID,
        order: where,
      },
      _sum: { amount: true },
    });

    return result._sum.amount ?? 0;
  }

  async sumRevenueByDay(
    where: Prisma.OrderWhereInput,
  ): Promise<{ date: string; revenue: number; orderCount: number }[]> {
    const conditions: Prisma.Sql[] = [Prisma.sql`TRUE`];

    if (where.status) {
      conditions.push(Prisma.sql`"status"::text = ${where.status as string}`);
    }

    const createdAt = where.createdAt as
      | { gte?: Date; lte?: Date }
      | undefined;

    if (createdAt?.gte) {
      conditions.push(Prisma.sql`"createdAt" >= ${createdAt.gte}`);
    }

    if (createdAt?.lte) {
      conditions.push(Prisma.sql`"createdAt" <= ${createdAt.lte}`);
    }

    const filter = Prisma.join(conditions, ' AND ');

    const rows = await this.prisma.$queryRaw<
      { day: Date; revenue: number; orderCount: bigint }[]
    >`
      SELECT DATE_TRUNC('day', "createdAt") AS day,
             COALESCE(SUM(total), 0) AS revenue,
             COUNT(*)::bigint AS "orderCount"
      FROM "orders"
      WHERE ${filter}
      GROUP BY 1
      ORDER BY 1 ASC
    `;

    return rows.map((row) => ({
      date: row.day.toISOString().slice(0, 10),
      revenue: Number(row.revenue),
      orderCount: Number(row.orderCount),
    }));
  }

  async sumRevenueByMonth(
    where: Prisma.OrderWhereInput,
  ): Promise<{ month: string; revenue: number; orderCount: number }[]> {
    const conditions: Prisma.Sql[] = [Prisma.sql`TRUE`];

    if (where.status) {
      conditions.push(Prisma.sql`"status"::text = ${where.status as string}`);
    }

    const createdAt = where.createdAt as
      | { gte?: Date; lte?: Date }
      | undefined;

    if (createdAt?.gte) {
      conditions.push(Prisma.sql`"createdAt" >= ${createdAt.gte}`);
    }

    if (createdAt?.lte) {
      conditions.push(Prisma.sql`"createdAt" <= ${createdAt.lte}`);
    }

    const filter = Prisma.join(conditions, ' AND ');

    const rows = await this.prisma.$queryRaw<
      { month: Date; revenue: number; orderCount: bigint }[]
    >`
      SELECT DATE_TRUNC('month', "createdAt") AS month,
             COALESCE(SUM(total), 0) AS revenue,
             COUNT(*)::bigint AS "orderCount"
      FROM "orders"
      WHERE ${filter}
      GROUP BY 1
      ORDER BY 1 ASC
    `;

    return rows.map((row) => ({
      month: row.month.toISOString().slice(0, 7),
      revenue: Number(row.revenue),
      orderCount: Number(row.orderCount),
    }));
  }

  async findTopProducts(
    where: Prisma.OrderWhereInput,
    limit: number,
  ): Promise<
    {
      productId: string;
      productName: string;
      quantity: number;
      revenue: number;
      orderCount: number;
    }[]
  > {
    const items = await this.prisma.orderItem.findMany({
      where: { order: where },
      select: { productId: true, productName: true, quantity: true, unitPrice: true, orderId: true },
    });

    const map = new Map<
      string,
      { productName: string; quantity: number; revenue: number; orders: Set<string> }
    >();

    for (const item of items) {
      const entry = map.get(item.productId) ?? {
        productName: item.productName,
        quantity: 0,
        revenue: 0,
        orders: new Set<string>(),
      };
      entry.productName = item.productName;
      entry.quantity += item.quantity;
      entry.revenue += item.quantity * item.unitPrice;
      entry.orders.add(item.orderId);
      map.set(item.productId, entry);
    }

    return [...map.entries()]
      .map(([productId, v]) => ({
        productId,
        productName: v.productName,
        quantity: v.quantity,
        revenue: Math.round(v.revenue * 100) / 100,
        orderCount: v.orders.size,
      }))
      .sort((a, b) => b.quantity - a.quantity || b.revenue - a.revenue)
      .slice(0, limit);
  }
}
