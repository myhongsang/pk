import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { OrderRepository } from '@app/modules/orders/order.repository';
import { OrderService } from '@app/modules/orders/order.service';

describe('OrderService', () => {
  let service: OrderService;
  let repository: OrderRepository;
  let repositoryMock: Record<keyof OrderRepository, jest.Mock>;

  const mockProduct = {
    id: 'product-1',
    name: 'Espresso',
    description: null,
    price: 20_000,
    stock: 10,
    categoryId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOrder = {
    id: 'order-1',
    userId: 'user-1',
    status: 'PENDING',
    total: 100_000,
    createdAt: new Date(),
    updatedAt: new Date(),
    items: [],
    payments: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: OrderRepository,
          useValue: {
            findProductsByIds: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            create: jest.fn(),
            updateStatus: jest.fn(),
            delete: jest.fn(),
            createPayment: jest.fn(),
            buildWhere: jest.fn().mockReturnValue({}),
            countOrders: jest.fn(),
            sumOrderTotal: jest.fn(),
            sumPaid: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    repository = module.get<OrderRepository>(OrderRepository);
    repositoryMock = repository as unknown as Record<
      keyof OrderRepository,
      jest.Mock
    >;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw NotFoundException when a product does not exist', async () => {
      (repository.findProductsByIds as jest.Mock).mockResolvedValue([]);

      await expect(
        service.create({
          userId: 'user-1',
          items: [{ productId: 'missing-product', quantity: 1 }],
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should compute the total and persist enriched items', async () => {
      (repository.findProductsByIds as jest.Mock).mockResolvedValue([
        mockProduct,
        { ...mockProduct, id: 'product-2', name: 'Latte', price: 35_000 },
      ]);
      (repository.create as jest.Mock).mockResolvedValue(mockOrder);

      await service.create({
        userId: 'user-1',
        items: [
          { productId: 'product-1', quantity: 2 },
          { productId: 'product-2', quantity: 1 },
        ],
      });

      expect(repositoryMock.create).toHaveBeenCalledWith(
        { userId: 'user-1', status: undefined },
        [
          {
            productId: 'product-1',
            productName: 'Espresso',
            quantity: 2,
            unitPrice: 20_000,
          },
          {
            productId: 'product-2',
            productName: 'Latte',
            quantity: 1,
            unitPrice: 35_000,
          },
        ],
        75_000,
      );
    });
  });

  describe('findAll', () => {
    it('should delegate pagination to the repository', async () => {
      const paginated = {
        data: [mockOrder],
        meta: { page: 1, limit: 25, total: 1, totalPages: 1 },
      };

      (repository.findAll as jest.Mock).mockResolvedValue(paginated);

      const result = await service.findAll({ page: 1, limit: 25 });

      expect(repositoryMock.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 25,
      });
      expect(result).toEqual(paginated);
    });
  });

  describe('findAll', () => {
    it('should return a paginated result from the repository', async () => {
      const paginated = {
        data: [mockOrder],
        meta: { page: 1, limit: 25, total: 1, totalPages: 1 },
      };
      (repository.findAll as jest.Mock).mockResolvedValue(paginated);

      const result = await service.findAll({
        page: 1,
        limit: 25,
        status: undefined,
      });

      expect(repositoryMock.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 25,
        status: undefined,
      });
      expect(result).toEqual(paginated);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException when the order does not exist', async () => {
      (repository.findById as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('order-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return the order when it exists', async () => {
      (repository.findById as jest.Mock).mockResolvedValue(mockOrder);

      const result = await service.findOne('order-1');

      expect(result).toEqual(mockOrder);
    });
  });

  describe('updateStatus', () => {
    it('should update the order status', async () => {
      (repository.findById as jest.Mock).mockResolvedValue(mockOrder);
      (repository.updateStatus as jest.Mock).mockResolvedValue({
        ...mockOrder,
        status: 'COMPLETED',
      });

      await service.updateStatus('order-1', { status: 'COMPLETED' });

      expect(repositoryMock.updateStatus).toHaveBeenCalledWith(
        'order-1',
        'COMPLETED',
      );
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException when the order does not exist', async () => {
      (repository.findById as jest.Mock).mockResolvedValue(null);

      await expect(service.remove('order-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should delete an existing order', async () => {
      (repository.findById as jest.Mock).mockResolvedValue(mockOrder);
      (repository.delete as jest.Mock).mockResolvedValue(undefined);

      await service.remove('order-1');

      expect(repositoryMock.delete).toHaveBeenCalledWith('order-1');
    });
  });

  describe('addPayment', () => {
    it('should throw NotFoundException when the order does not exist', async () => {
      (repository.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        service.addPayment('order-1', { amount: 50_000, status: 'PAID' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should create the payment for an existing order', async () => {
      (repository.findById as jest.Mock).mockResolvedValue(mockOrder);
      (repository.createPayment as jest.Mock).mockResolvedValue({
        id: 'payment-1',
        orderId: 'order-1',
        amount: 50_000,
        status: 'PAID',
        paidAt: new Date(),
      });

      await service.addPayment('order-1', { amount: 50_000, status: 'PAID' });

      expect(repositoryMock.createPayment).toHaveBeenCalledWith(
        'order-1',
        50_000,
        'PAID',
      );
    });
  });

  describe('getStatistics', () => {
    it('should compute totalUnpaid as orderValue minus totalPaid', async () => {
      (repository.countOrders as jest.Mock).mockResolvedValue(3);
      (repository.sumOrderTotal as jest.Mock).mockResolvedValue(200_000);
      (repository.sumPaid as jest.Mock).mockResolvedValue(120_000);

      const result = await service.getStatistics({});

      expect(result).toEqual({
        orderCount: 3,
        orderValue: 200_000,
        totalPaid: 120_000,
        totalUnpaid: 80_000,
      });
    });

    it('should default to zero when there is no data', async () => {
      (repository.countOrders as jest.Mock).mockResolvedValue(0);
      (repository.sumOrderTotal as jest.Mock).mockResolvedValue(0);
      (repository.sumPaid as jest.Mock).mockResolvedValue(0);

      const result = await service.getStatistics({});

      expect(result).toEqual({
        orderCount: 0,
        orderValue: 0,
        totalPaid: 0,
        totalUnpaid: 0,
      });
    });
  });
});
