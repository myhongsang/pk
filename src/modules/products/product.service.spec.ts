import { Test, TestingModule } from '@nestjs/testing';

import { ProductRepository } from '@app/modules/products/product.repository';
import { ProductService } from '@app/modules/products/product.service';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService, { provide: ProductRepository, useValue: {} }],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
