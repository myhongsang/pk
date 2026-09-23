import { z } from 'zod';

export const statisticsQuerySchema = z.object({
  from: z.coerce.date('Invalid from date').optional(),
  to: z.coerce.date('Invalid to date').optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']).optional(),
});

export type StatisticsQueryDto = z.infer<typeof statisticsQuerySchema>;
