import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards,} from '@nestjs/common';

import { JwtAuthGuard } from '@app/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@app/modules/auth/guards/roles.guard';
import { Roles } from '@app/modules/auth/decorators/roles.decorator';
import { ROLE_ADMIN, ROLE_EMPLOYEE } from '@app/constants/role.constants';
import { paginationQuerySchema, type PaginationQueryDto,} from '@app/common/dto/pagination.dto';
import { ZodValidationPipe } from '@app/utils/zod-validation.pipe';
import { createUserSchema } from '@app/modules/users/dto/create-user.dto';
import type { CreateUserDto } from '@app/modules/users/dto/create-user.dto';
import { updateUserSchema } from '@app/modules/users/dto/update-user.dto';
import type { UpdateUserDto } from '@app/modules/users/dto/update-user.dto';
import { UsersService } from '@app/modules/users/users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(ROLE_ADMIN, ROLE_EMPLOYEE)
  create(@Body(new ZodValidationPipe(createUserSchema)) dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  @Roles(ROLE_ADMIN, ROLE_EMPLOYEE)
  findAll(
    @Query(new ZodValidationPipe(paginationQuerySchema))
    pagination: PaginationQueryDto,
  ) {
    return this.usersService.findAll(pagination);
  }

  @Get(':id')
  @Roles(ROLE_ADMIN, ROLE_EMPLOYEE)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(ROLE_ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateUserSchema)) dto: UpdateUserDto,
  ) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @Roles(ROLE_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.usersService.remove(id);
  }
}
