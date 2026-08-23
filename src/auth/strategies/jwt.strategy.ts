import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_PUBLIC_KEY } from '../constants/jwt.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_PUBLIC_KEY,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
      name: payload.name,
    };
  }
}