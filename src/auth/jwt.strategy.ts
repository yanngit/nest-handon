import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { authConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConstants.jwtSecret,
      expiresIn: authConstants.jwtExpirationTime,
    });
  }

  async validate(payload: any) {
    /*Here is the place to add more user info for backend processing
     * It should not be inside the JWT because JWT must have minimal infos
     */
    return { userId: payload.sub, username: payload.username };
  }
}
