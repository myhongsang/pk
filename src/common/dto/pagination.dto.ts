import { z } from 'zod';

import { PAGINATION_DEFAULT_LIMIT, PAGINATION_DEFAULT_PAGE, PAGINATION_MAX_LIMIT,} from '@app/constants/pagination.constants';

export const paginationQuerySchema = z.object({
  page: z.coerce
    .number()
    .int('Page must be an integer')
    .min(1, 'Page must be greater than or equal to 1')
    .default(PAGINATION_DEFAULT_PAGE),

  limit: z.coerce
    .number()
    .int('Limit must be an integer')
    .min(1, 'Limit must be greater than or equal to 1')
    .max(
      PAGINATION_MAX_LIMIT,
      `Limit must be less than or equal to ${PAGINATION_MAX_LIMIT}`,
    )
    .default(PAGINATION_DEFAULT_LIMIT),
});

export type PaginationQueryDto = z.infer<typeof paginationQuerySchema>;

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export function createPaginatedResult<T>(
  data: T[],
  total: number,
  { page, limit }: PaginationQueryDto,
): PaginatedResult<T> {
  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
