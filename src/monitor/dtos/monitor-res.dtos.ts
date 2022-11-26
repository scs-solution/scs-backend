import { object } from 'joi';

export class MonitorResInstanceMetric {
  name: string;
  publicIp: string;
  cpu: number;
  memoryCapacity: number;
  hotMemory: number;
  ramTotal: number;
  txBps: number;
  rxBps: number;
  pingpong: string;
}

export class MonitorResDto {
  instances: MonitorResInstanceMetric[];
}
