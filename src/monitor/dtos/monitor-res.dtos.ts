export class MonitorResInstanceMetric {
  name: string;
  publicIp: string;
  cpu: number;
  memoryCapacity: number;
  hotMemory: number;
  ramTotal: number;
  txBps: number;
  rxBps: number;
}

export class MonitorResDto {
  instances: MonitorResInstanceMetric[];
}
