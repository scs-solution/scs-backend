import { IsString } from 'class-validator';

export class InstanceAMIUpdateDto {
  @IsString()
  updateKey: string;

  @IsString()
  instanceId: string;

  @IsString()
  amiId: string;
}

export class InstanceSpotUpdateDto {
  @IsString()
  instanceId: string;

  @IsString()
  newInstanceId: string;

  @IsString()
  newPrivateIp: string;

  @IsString()
  requestId: string;

  @IsString()
  updateKey: string;
}
