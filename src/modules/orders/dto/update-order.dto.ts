import { z } from 'zod';

export const updateOrderSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']),
});

export type UpdateOrderDto = z.infer<typeof updateOrderSchema>;
