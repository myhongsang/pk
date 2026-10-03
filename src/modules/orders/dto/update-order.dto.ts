import { z } from 'zod';

import { ORDER_STATUS_VALUES } from '@app/constants/order.constants';

export const updateOrderSchema = z.object({
  status: z.enum(ORDER_STATUS_VALUES),
});

export type UpdateOrderDto = z.infer<typeof updateOrderSchema>;
