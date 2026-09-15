import { PAGINATION_DEFAULT_LIMIT, PAGINATION_MAX_LIMIT,} from '@app/constants/pagination.constants';
import { paginationQuerySchema } from '@app/common/dto/pagination.dto';

describe('paginationQuerySchema', () => {
  it('applies default page and limit when query is empty', () => {
    expect(paginationQuerySchema.parse({})).toEqual({
      page: 1,
      limit: PAGINATION_DEFAULT_LIMIT,
    });
  });

  it('coerces numeric strings from query params', () => {
    expect(paginationQuerySchema.parse({ page: '3', limit: '10' })).toEqual({
      page: 3,
      limit: 10,
    });
  });

  it('strips unknown query params', () => {
    expect(
      paginationQuerySchema.parse({ page: '2', categoryId: 'abc' }),
    ).toEqual({ page: 2, limit: PAGINATION_DEFAULT_LIMIT });
  });

  it('rejects a page below 1', () => {
    expect(() => paginationQuerySchema.parse({ page: '0' })).toThrow();
  });

  it('rejects a non-integer page', () => {
    expect(() => paginationQuerySchema.parse({ page: '1.5' })).toThrow();
  });

  it('rejects a limit above the maximum', () => {
    expect(() =>
      paginationQuerySchema.parse({ limit: String(PAGINATION_MAX_LIMIT + 1) }),
    ).toThrow();
  });

  it('accepts a limit equal to the maximum', () => {
    expect(
      paginationQuerySchema.parse({ limit: String(PAGINATION_MAX_LIMIT) }),
    ).toEqual({ page: 1, limit: PAGINATION_MAX_LIMIT });
  });

  it('rejects a non-numeric limit', () => {
    expect(() => paginationQuerySchema.parse({ limit: 'abc' })).toThrow();
  });
});
