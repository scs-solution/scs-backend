import { IsString } from 'class-validator';

export class UserRegisterDTO {
  @IsString()
  id: string;

  @IsString()
  password: string;
}
