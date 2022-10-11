import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from 'src/user/user.repository';
import { AuthService } from '../auth.service';
import { JwtPayload } from './jwt.payload';
import { jwtExtractorFromCookies } from './jwtExtractorFromCookies';

// guard -> strategy -> validate
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([jwtExtractorFromCookies]),
      secretOrKey: configService.get<string>('REFRESH_TOKEN_SECRET_KEY'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    try {
      const user = await this.userRepository.findOneBy({
        userId: payload.userId,
      });
      if (user.refreshToken) {
        return user;
      } else {
        throw new Error('Retry after login');
      }
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
