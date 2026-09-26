import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from '@app/modules/auth/auth.service';
import { UserRepository } from '@app/modules/users/user.repository';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: {} },
        { provide: UserRepository, useValue: { findByEmail: jest.fn() } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    const mockUser = {
      id: 'uuid-1',
      name: 'Alice',
      email: 'alice@example.com',
      password: 'hashed-password',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should return null when the user does not exist', async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(
        service.validateUser('alice@example.com', 'secret123'),
      ).resolves.toBeNull();
    });

    it('should return null when the user is inactive', async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue({
        ...mockUser,
        status: 'INACTIVE',
      });

      await expect(
        service.validateUser('alice@example.com', 'secret123'),
      ).resolves.toBeNull();
    });
  });
});
