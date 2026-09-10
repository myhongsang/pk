import { BadRequestException, ConflictException, Injectable, NotFoundException,} from '@nestjs/common';
import { User } from '@prisma/client';

import { PasswordUtils } from '@app/utils/password.util';
import { CreateUserDto } from '@app/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@app/modules/users/dto/update-user.dto';
import { UserRepository } from '@app/modules/users/user.repository';

type SafeUser = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(data: CreateUserDto): Promise<SafeUser> {
    const existing = await this.userRepository.findByEmail(data.email);

    if (existing) {
      throw new ConflictException(
        `User with email ${data.email} already exists`,
      );
    }

    const hashedPassword = await PasswordUtils.hash(data.password);

    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    return this.sanitize(user);
  }

  async findAll(): Promise<SafeUser[]> {
    const users = await this.userRepository.findAll();

    return users.map((user) => this.sanitize(user));
  }

  async findOne(id: string): Promise<SafeUser> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.sanitize(user);
  }

  async update(id: string, data: UpdateUserDto): Promise<SafeUser> {
    await this.findOne(id);

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields to update');
    }

    if (data.email) {
      const existing = await this.userRepository.findByEmail(data.email);

      if (existing && existing.id !== id) {
        throw new ConflictException(
          `User with email ${data.email} already exists`,
        );
      }
    }

    const updateData: UpdateUserDto = { ...data };

    if (data.password) {
      updateData.password = await PasswordUtils.hash(data.password);
    }

    const user = await this.userRepository.update(id, updateData);

    return this.sanitize(user);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.userRepository.delete(id);
  }

  private sanitize(user: User): SafeUser {
    const { password: _password, ...safeUser } = user;
    return safeUser;
  }
}
