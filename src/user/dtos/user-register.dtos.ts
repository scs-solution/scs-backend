import { IsString, Length, Matches } from 'class-validator';

export class UserRegisterDTO {
  @IsString()
  @Length(4, 20)
  @Matches(/^\w+$/, {
    message:
      'Id must be between 4 and 20 characters long with number or alphabet',
  })
  userId: string;

  @IsString()
  @Length(8, 50)
  password: string;
}
