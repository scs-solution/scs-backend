import { IsString, Matches } from 'class-validator';

export class InstanceCreateDto {
  @IsString()
  @Matches(/^[\w ]{4,20}$/, {
    message:
      'Instance name must be between 4 and 20 characters long with number, space or alphabet',
  })
  name: string;

  @IsString()
  infraName: string;

  @IsString()
  instanceType: 'normal' | 'spot' | 'mysql' | 'redis';

  @IsString()
  instanceSpec: string; // ex) t2.micro, c4.x5large
}
