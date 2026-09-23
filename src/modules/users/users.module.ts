import { Module } from '@nestjs/common';

import { PrismaModule } from '@app/prisma/prisma.module';
import { UserRepository } from '@app/modules/users/user.repository';
import { UsersController } from '@app/modules/users/users.controller';
import { UsersService } from '@app/modules/users/users.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}
