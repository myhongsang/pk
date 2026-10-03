import { z } from 'zod';

import {
  PAYMENT_STATUS_PAID,
  PAYMENT_STATUS_VALUES,
} from '@app/constants/order.constants';

export const createPaymentSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  status: z.enum(PAYMENT_STATUS_VALUES).default(PAYMENT_STATUS_PAID),
});

export type CreatePaymentDto = z.infer<typeof createPaymentSchema>;
