import { IsString, Length } from 'class-validator';

export class UserRegisterDTO {
  @IsString()
  @Length(4, 20)
  userId: string;

  @IsString()
  @Length(8, 50)
  password: string;
}
