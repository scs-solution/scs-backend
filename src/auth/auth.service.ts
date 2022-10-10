import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRegisterDTO } from 'src/user/dtos/user-register.dtos';
import { UserRepository } from 'src/user/user.repository';
import { ResLoginUser } from './dtos/res-login-user.dto';
import { Tokens } from './jwt/jwt.token';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async verifyUserAndSignJWT(dto: UserRegisterDTO): Promise<ResLoginUser> {
    const user = await this.userRepository.findOneBy({ userId: dto.userId });
    if (!user) {
      throw new Error('User id is not found');
    }
    try {
      const tokens = await this.createJWT(user.userId);
      await this.updateRefreshToken(user.userId, tokens.refreshToken);

      return { user, tokens };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(dto: UserRegisterDTO) {
    const payload = { username: dto.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async createJWT(userId: string): Promise<Tokens> {
    const accessExpires = Number(
      new Date(
        Date.now() + Number(this.configService.get<string>('ACCESS_EXPIRES')),
      ),
    );
    const refreshExpires = Number(
      new Date(
        Date.now() + Number(this.configService.get<string>('REFRESH_EXPIRES')),
      ),
    );
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          userId,
        },
        {
          secret: this.configService.get<string>('ACCESS_TOKEN_SECRET_KEY'),
          expiresIn: accessExpires,
        },
      ),
      this.jwtService.signAsync(
        {
          userId,
        },
        {
          secret: this.configService.get<string>('REFRESH_TOKEN_SECRET_KEY'),
          expiresIn: refreshExpires,
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    await this.userRepository.update({ userId }, { refreshToken });
  }

  async refreshTokens(refreshToken: string): Promise<ResLoginUser> {
    const user = await this.userRepository.findOneBy({
      refreshToken: refreshToken,
    });

    if (!user) {
      throw new HttpException('Invalid Token', 401);
    }

    const tokens = await this.createJWT(user.userId);
    await this.updateRefreshToken(user.userId, tokens.refreshToken);

    return { tokens, user };
  }

  async deleteRefreshToken(userId: string) {
    await this.userRepository.update({ userId }, { refreshToken: null });
  }
}
