import { Injectable, NotFoundException } from '@nestjs/common';
import { Order, Payment } from '@prisma/client';

import type { PaginatedResult } from '@app/common/dto/pagination.dto';
import { CreateOrderDto } from '@app/modules/orders/dto/create-order.dto';
import type { OrderItemCreateInput } from '@app/modules/orders/dto/create-order.dto';
import type { CreatePaymentDto } from '@app/modules/orders/dto/create-payment.dto';
import type { OrderQueryDto } from '@app/modules/orders/dto/order-query.dto';
import { StatisticsQueryDto } from '@app/modules/orders/dto/statistics-query.dto';
import { UpdateOrderDto } from '@app/modules/orders/dto/update-order.dto';
import { OrderRepository } from '@app/modules/orders/order.repository';

export interface OrderStatistics {
  orderCount: number;
  orderValue: number;
  totalPaid: number;
  totalUnpaid: number;
}

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async create(data: CreateOrderDto): Promise<Order> {
    const uniqueProductIds = [
      ...new Set(data.items.map((item) => item.productId)),
    ];

    const products =
      await this.orderRepository.findProductsByIds(uniqueProductIds);

    if (products.length !== uniqueProductIds.length) {
      const foundIds = new Set(products.map((product) => product.id));
      const missingIds = uniqueProductIds.filter(
        (productId) => !foundIds.has(productId),
      );

      throw new NotFoundException(
        `Products not found: ${missingIds.join(', ')}`,
      );
    }

    const productMap = new Map(
      products.map((product) => [product.id, product]),
    );

    const items: OrderItemCreateInput[] = data.items.map(
      ({ productId, quantity }) => {
        const product = productMap.get(productId);

        if (!product) {
          throw new NotFoundException(`Product with id ${productId} not found`);
        }

        return {
          productId,
          productName: product.name,
          quantity,
          unitPrice: product.price,
        };
      },
    );

    const total = items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );

    return this.orderRepository.create(
      { userId: data.userId, status: data.status },
      items,
      Math.round(total * 100) / 100,
    );
  }

  findAll(query: OrderQueryDto): Promise<PaginatedResult<Order>> {
    return this.orderRepository.findAll(query);
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return order;
  }

  async updateStatus(id: string, data: UpdateOrderDto): Promise<Order> {
    await this.findOne(id);

    return this.orderRepository.updateStatus(id, data.status);
  }

  async addPayment(id: string, data: CreatePaymentDto): Promise<Payment> {
    await this.findOne(id);

    return this.orderRepository.createPayment(id, data.amount, data.status);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.orderRepository.delete(id);
  }

  async getStatistics(query: StatisticsQueryDto): Promise<OrderStatistics> {
    const where = this.orderRepository.buildWhere(query);

    const [orderCount, orderValue, totalPaid] = await Promise.all([
      this.orderRepository.countOrders(where),
      this.orderRepository.sumOrderTotal(where),
      this.orderRepository.sumPaid(where),
    ]);

    return {
      orderCount,
      orderValue,
      totalPaid,
      totalUnpaid: Math.round((orderValue - totalPaid) * 100) / 100,
    };
  }
}
