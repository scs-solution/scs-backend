import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/user/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './jwt/access-token.strategy';
import { RefreshTokenStrategy } from './jwt/refresh-token.strategy';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [JwtModule.register({}), UserModule],
  providers: [
    AuthService,
    UserRepository,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
