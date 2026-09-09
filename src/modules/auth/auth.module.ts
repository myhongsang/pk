import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JWT_ALGORITHM, JWT_EXPIRES_IN, JWT_PRIVATE_KEY, JWT_PUBLIC_KEY } from '../../constants/jwt.constants';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

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
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}