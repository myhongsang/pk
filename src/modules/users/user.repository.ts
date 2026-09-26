import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { PrismaService } from '@app/prisma/prisma.service';
import { SORT_ORDER_DESC } from '@app/constants/sort.constants';
import {
  STATUS_ACTIVE,
  STATUS_INACTIVE,
} from '@app/constants/status.constants';
import { createPaginatedResult, type PaginatedResult, type PaginationQueryDto,} from '@app/common/dto/pagination.dto';
import { CreateUserDto } from '@app/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@app/modules/users/dto/update-user.dto';

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

  async findAll({
    page,
    limit,
    q,
  }: PaginationQueryDto): Promise<PaginatedResult<User>> {
    const where: Prisma.UserWhereInput = {
      status: STATUS_ACTIVE,
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { email: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        orderBy: { createdAt: SORT_ORDER_DESC },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return createPaginatedResult(users, total, { page, limit });
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

  softDelete(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { status: STATUS_INACTIVE },
    });
  }
}
