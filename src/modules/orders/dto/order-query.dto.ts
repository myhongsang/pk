import { z } from 'zod';

import { ORDER_STATUS_VALUES } from '@app/constants/order.constants';
import { paginationQuerySchema } from '@app/common/dto/pagination.dto';

export const orderQuerySchema = paginationQuerySchema.omit({ q: true }).extend({
  status: z.enum(ORDER_STATUS_VALUES).optional(),
});

export type OrderQueryDto = z.infer<typeof orderQuerySchema>;
