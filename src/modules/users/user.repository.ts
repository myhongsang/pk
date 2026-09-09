import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { SORT_ORDER_DESC } from '../../constants/sort.constants';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      orderBy: { createdAt: SORT_ORDER_DESC },
    });
  }

  create(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({ data });
  }

  update(id: string, data: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}