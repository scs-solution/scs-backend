import { IsString, Matches } from 'class-validator';

export class InfraCreateDto {
  @IsString()
  @Matches(/^\w{4,20}$/, {
    message:
      'Infra name must be between 4 and 20 characters long with number or alphabet',
  })
  name: string;
}
