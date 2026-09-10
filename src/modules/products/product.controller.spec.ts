import { Test, TestingModule } from '@nestjs/testing';

import { JwtAuthGuard } from '@app/modules/auth/guards/jwt-auth.guard';
import { ProductController } from '@app/modules/products/product.controller';
import { ProductService } from '@app/modules/products/product.service';

describe('ProductController', () => {
  let controller: ProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        { provide: ProductService, useValue: {} },
        {
          provide: JwtAuthGuard,
          useValue: { canActivate: () => true },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
