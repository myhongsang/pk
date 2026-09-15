import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

import { JWT_ALGORITHM, JWT_EXPIRES_IN, JWT_PRIVATE_KEY,} from '@app/constants/jwt.constants';
import { PasswordUtils } from '@app/utils/password.util';
import { UserRepository } from '@app/modules/users/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return null;
    }

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
      algorithm: JWT_ALGORITHM,
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
