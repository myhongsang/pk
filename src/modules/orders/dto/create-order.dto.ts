import { z } from 'zod';

import { ORDER_STATUS_VALUES } from '@app/constants/order.constants';

export const createOrderItemSchema = z.object({
  productId: z.uuid('Product id must be a valid UUID'),
  quantity: z
    .number()
    .int('Quantity must be an integer')
    .min(1, 'Quantity must be at least 1'),
});

export const createOrderSchema = z.object({
  userId: z.uuid('User id must be a valid UUID'),
  status: z.enum(ORDER_STATUS_VALUES).optional(),
  items: z
    .array(createOrderItemSchema)
    .min(1, 'Order must contain at least one item'),
});

export type CreateOrderItemDto = z.infer<typeof createOrderItemSchema>;
export type CreateOrderDto = z.infer<typeof createOrderSchema>;

export type OrderItemCreateInput = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
};
