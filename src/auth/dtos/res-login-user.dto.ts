import { User } from 'src/user/entities/user.entity';
import { Tokens } from '../jwt/jwt.token';

export class ResLoginUser {
  tokens: Tokens;
  user: User;
}
