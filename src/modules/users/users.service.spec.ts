import { ConflictException, NotFoundException,} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { UserRepository } from './user.repository';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UserRepository;

  const mockUser = {
    id: 'uuid-1',
    name: 'Alice',
    email: 'alice@example.com',
    password: 'hashed-password',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw ConflictException when the email is already taken', async () => {
      (repository.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        service.create({
          name: 'Alice',
          email: 'alice@example.com',
          password: 'secret123',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should hash the password before persisting the user', async () => {
      (repository.findByEmail as jest.Mock).mockResolvedValue(null);
      (repository.create as jest.Mock).mockResolvedValue(mockUser);

      await service.create({
        name: 'Alice',
        email: 'alice@example.com',
        password: 'secret123',
      });

      const createArg = (repository.create as jest.Mock).mock.calls[0][0];

      expect(createArg.password).not.toBe('secret123');
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Alice',
          email: 'alice@example.com',
        }),
      );
    });

    it('should not expose the password in the result', async () => {
      (repository.findByEmail as jest.Mock).mockResolvedValue(null);
      (repository.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.create({
        name: 'Alice',
        email: 'alice@example.com',
        password: 'secret123',
      });

      expect(result).not.toHaveProperty('password');
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException when the user does not exist', async () => {
      (repository.findById as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('uuid-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return the user without the password', async () => {
      (repository.findById as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findOne('uuid-1');

      expect(result.email).toBe('alice@example.com');
      expect(result).not.toHaveProperty('password');
    });
  });

  describe('update', () => {
    it('should throw NotFoundException when the user does not exist', async () => {
      (repository.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        service.update('uuid-1', { name: 'Bob' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should hash the new password before updating', async () => {
      (repository.findById as jest.Mock).mockResolvedValue(mockUser);
      (repository.findByEmail as jest.Mock).mockResolvedValue(null);
      (repository.update as jest.Mock).mockResolvedValue(mockUser);

      await service.update('uuid-1', { password: 'new-secret' });

      const updateArg = (repository.update as jest.Mock).mock.calls[0][1];

      expect(updateArg.password).not.toBe('new-secret');
    });

    it('should throw ConflictException when updating to another users email', async () => {
      (repository.findById as jest.Mock).mockResolvedValue(mockUser);
      (repository.findByEmail as jest.Mock).mockResolvedValue({
        ...mockUser,
        id: 'uuid-2',
      });

      await expect(
        service.update('uuid-1', { email: 'alice@example.com' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException when the user does not exist', async () => {
      (repository.findById as jest.Mock).mockResolvedValue(null);

      await expect(service.remove('uuid-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should delete the user when it exists', async () => {
      (repository.findById as jest.Mock).mockResolvedValue(mockUser);
      (repository.delete as jest.Mock).mockResolvedValue(undefined);

      await service.remove('uuid-1');

      expect(repository.delete).toHaveBeenCalledWith('uuid-1');
    });
  });
});
