import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  Matches,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class InstanceCreateDtoInitialDescription {
  @IsNotEmpty()
  @ValidateIf((o) => !(o.initialScript && !o.imageName))
  imageName: string;

  @IsNotEmpty()
  @ValidateIf((o) => !(o.imageName && !o.initialScript))
  initialScript: string;

  @IsString()
  @IsNotEmpty()
  runScript: string;
}

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

  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @IsDefined()
  @Type(() => InstanceCreateDtoInitialDescription)
  initialDesc: InstanceCreateDtoInitialDescription;
}
