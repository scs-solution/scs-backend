import { IsString } from 'class-validator';

export class InfraUpdateDtoInstance {
  @IsString()
  name: string;

  @IsString()
  instanceId: string;

  @IsString()
  privateIp: string;

  @IsString()
  publicIp: string;
}

export class InfraUpdateDto {
  @IsString()
  updateKey: string;

  @IsString()
  infraName: string;

  instances?: InfraUpdateDtoInstance[];
}
