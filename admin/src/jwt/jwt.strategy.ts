import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';




@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `qwwer6uyxtagcsdyjvgisdkghvbckljdshnckusdvgasdfadsnlkfiuaewikjfnla;ksulhdikfjycuikdsgchjksdb12312hnlvbhlsjbvdjhnls*&$123bhlkjbvcscascasdfvgdcasgx`,
    });
  }

  async validate(payload: any) {
    // const user = await this.usersService.findOne(payload.phone);
    return { userId: payload._id, phoneNumber: payload.phoneNumber };
  }
}

