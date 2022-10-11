import { Exclude } from 'class-transformer';

export class InfraInstance {
  name: string;

  @Exclude()
  instanceId?: string;

  instanceType: 'normal' | 'spot' | 'mysql' | 'redis';
  instanceSpec: string; // ex) t2.micro, c4.x5large

  @Exclude()
  privateIp?: string;
  publicIp?: string;
}
