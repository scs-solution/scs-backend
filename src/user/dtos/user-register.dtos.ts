import { IsString, Matches } from 'class-validator';

export class UserRegisterDTO {
  @IsString()
  @Matches(/^\w{4,20}$/, {
    message:
      'Id must be between 4 and 20 characters long with number or alphabet',
  })
  userId: string;

  @IsString()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&+=]).{6,64}$/, {
    message:
      'Password must be between 6 and 64 characters long with 1 special character and capital character each',
  })
  password: string;
}
