import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '@app/modules/auth/auth.service';
import type { LoginDto } from '@app/modules/auth/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDTO: LoginDto) {
    const user = await this.authService.validateUser(
      loginDTO.email,
      loginDTO.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.authService.login(user);
  }
}
