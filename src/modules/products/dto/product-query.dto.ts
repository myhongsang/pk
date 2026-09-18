import { z } from 'zod';

import { paginationQuerySchema } from '@app/common/dto/pagination.dto';

export const productQuerySchema = paginationQuerySchema
  .extend({
    minPrice: z.coerce
      .number()
      .min(0, 'minPrice must be greater than or equal to 0')
      .optional(),

    maxPrice: z.coerce
      .number()
      .min(0, 'maxPrice must be greater than or equal to 0')
      .optional(),
  })
  .refine(
    ({ minPrice, maxPrice }) =>
      minPrice === undefined
      || maxPrice === undefined
      || minPrice <= maxPrice,
    { message: 'minPrice must be less than or equal to maxPrice' },
  );

export type ProductQueryDto = z.infer<typeof productQuerySchema>;