import { productQuerySchema } from '@app/modules/products/dto/product-query.dto';

describe('productQuerySchema', () => {
  it('inherits pagination defaults when query is empty', () => {
    expect(productQuerySchema.parse({})).toEqual({
      page: 1,
      limit: 25,
    });
  });

  it('coerces price bounds from query strings', () => {
    expect(
      productQuerySchema.parse({ page: '2', minPrice: '10.5', maxPrice: '20' }),
    ).toEqual({
      page: 2,
      limit: 25,
      minPrice: 10.5,
      maxPrice: 20,
    });
  });

  it('rejects a negative price bound', () => {
    expect(() => productQuerySchema.parse({ minPrice: '-1' })).toThrow();
  });

  it('rejects minPrice greater than maxPrice', () => {
    expect(() =>
      productQuerySchema.parse({ minPrice: '30', maxPrice: '20' }),
    ).toThrow();
  });
});