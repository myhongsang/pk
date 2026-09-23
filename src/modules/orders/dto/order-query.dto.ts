import { z } from 'zod';

import { paginationQuerySchema } from '@app/common/dto/pagination.dto';

export const orderQuerySchema = paginationQuerySchema.omit({ q: true }).extend({
  status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']).optional(),
});

export type OrderQueryDto = z.infer<typeof orderQuerySchema>;
