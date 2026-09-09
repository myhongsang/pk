import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';

import { AuthService } from './auth.service';
import type { LoginDto } from './dto/login.dto';
import { ROUTE_AUTH, ROUTE_LOGIN } from '../../constants/route.constants';

@Controller(ROUTE_AUTH)
export class AuthController {

    constructor(
        private readonly authService: AuthService, 
    ) {}

    @Post(ROUTE_LOGIN)
    async login(@Body() loginDTO: LoginDto) {
        const user = await this.authService.validateUser(loginDTO.email, loginDTO.password);
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }
        return this.authService.login(user);
    }
}
