import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { PasswordUtils } from './utils/password.util';
import {
  JWT_PRIVATE_KEY,
  JWT_EXPIRES_IN,
} from './constants/jwt.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<User | null> {
    // Tìm user trong PostgreSQL
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      return null;
    }

    // Kiểm tra password bằng bcrypt
    const isPasswordValid = await PasswordUtils.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async login(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const accessToken = this.jwtService.sign(payload, {
      privateKey: JWT_PRIVATE_KEY,
      algorithm: 'RS256',
      expiresIn: JWT_EXPIRES_IN,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}