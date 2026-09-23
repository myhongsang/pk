import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_ALGORITHM, JWT_IGNORE_EXPIRATION, JWT_PUBLIC_KEY,} from '@app/constants/jwt.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: JWT_IGNORE_EXPIRATION,
      secretOrKey: JWT_PUBLIC_KEY,
      algorithms: [JWT_ALGORITHM],
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
