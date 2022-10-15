import { IsString, Matches } from 'class-validator';

export class InstanceCreateDto {
  @IsString()
  @Matches(/^[\w-]{4,20}$/, {
    message:
      'Instance name must be between 4 and 20 characters long with number, alphabet or dash',
  })
  name: string;

  @IsString()
  infraName: string;

  @Matches(/^(normal|spot|mysql|redis)$/)
  @IsString()
  instanceType: 'normal' | 'spot' | 'mysql' | 'redis';

  @IsString()
  instanceSpec: string; // ex) t2.micro, c4.x5large
}
