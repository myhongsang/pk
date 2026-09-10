import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JWT_ALGORITHM, JWT_EXPIRES_IN, JWT_PRIVATE_KEY, JWT_PUBLIC_KEY,} from '@app/constants/jwt.constants';
import { UsersModule } from '@app/modules/users/users.module';
import { AuthController } from '@app/modules/auth/auth.controller';
import { AuthService } from '@app/modules/auth/auth.service';
import { JwtStrategy } from '@app/modules/auth/strategies/jwt.strategy';
import { JwtAuthGuard } from '@app/modules/auth/guards/jwt-auth.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      privateKey: JWT_PRIVATE_KEY,
      publicKey: JWT_PUBLIC_KEY,
      signOptions: {
        algorithm: JWT_ALGORITHM,
        expiresIn: JWT_EXPIRES_IN,
      },
      verifyOptions: {
        algorithms: [JWT_ALGORITHM],
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
