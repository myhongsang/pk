import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post,} from '@nestjs/common';

import { ROUTE_USERS } from '@app/constants/route.constants';
import { ZodValidationPipe } from '@app/utils/zod-validation.pipe';
import { createUserSchema } from '@app/modules/users/dto/create-user.dto';
import type { CreateUserDto } from '@app/modules/users/dto/create-user.dto';
import { updateUserSchema } from '@app/modules/users/dto/update-user.dto';
import type { UpdateUserDto } from '@app/modules/users/dto/update-user.dto';
import { UsersService } from '@app/modules/users/users.service';

@Controller(ROUTE_USERS)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body(new ZodValidationPipe(createUserSchema)) dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateUserSchema)) dto: UpdateUserDto,
  ) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.usersService.remove(id);
  }
}
