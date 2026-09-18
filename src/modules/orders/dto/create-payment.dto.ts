import { z } from 'zod';

export const createPaymentSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  status: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']).default('PAID'),
});

export type CreatePaymentDto = z.infer<typeof createPaymentSchema>;
