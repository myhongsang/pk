import { z } from 'zod';

import { ORDER_STATUS_VALUES } from '@app/constants/order.constants';

export const statisticsQuerySchema = z.object({
  from: z.coerce.date('Invalid from date').optional(),
  to: z.coerce.date('Invalid to date').optional(),
  status: z.enum(ORDER_STATUS_VALUES).optional(),
});

export type StatisticsQueryDto = z.infer<typeof statisticsQuerySchema>;
