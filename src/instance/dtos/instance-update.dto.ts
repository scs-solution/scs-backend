import { IsString } from 'class-validator';

export class InstanceAMIUpdateDto {
  @IsString()
  updateKey: string;

  @IsString()
  instanceId: string;

  @IsString()
  amiId: string;
}
