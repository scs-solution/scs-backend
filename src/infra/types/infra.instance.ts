export class InfraInstance {
  name: string;
  instanceId?: string;
  instanceType: 'normal' | 'spot' | 'mysql' | 'redis';
  instanceSpec: string; // ex) t2.micro, c4.x5large
  privateIp?: string;
  publicIp?: string;
}
