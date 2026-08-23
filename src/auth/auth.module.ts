import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JWT_PRIVATE_KEY, JWT_PUBLIC_KEY, JWT_EXPIRES_IN } from './constants/jwt.constants';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      privateKey: JWT_PRIVATE_KEY,
      publicKey: JWT_PUBLIC_KEY,
      signOptions: {
        algorithm: 'RS256',
        expiresIn: JWT_EXPIRES_IN,
      },
      verifyOptions: {
        algorithms: ['RS256'],
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}