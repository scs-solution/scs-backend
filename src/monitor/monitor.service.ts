import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InfraRepository } from 'src/infra/infra.repository';
import { InfraDescription } from 'src/infra/types/infra.desc';
import { MonitorPostDto } from './dtos/monitor-post.dtos';
import {
  MonitorResDto,
  MonitorResInstanceMetric,
} from './dtos/monitor-res.dtos';

@Injectable()
export class MonitorService {
  constructor(private readonly infraRepository: InfraRepository) {}

  async monitor(dto: MonitorPostDto): Promise<MonitorResDto> {
    const infra = await this.infraRepository.findOneBy({ name: dto.infraName });
    const infraDesc: InfraDescription = JSON.parse(infra.desc);
    const instances: MonitorResInstanceMetric[] = [];

    if (infraDesc.instances !== undefined) {
      for (const instance of infraDesc.instances) {
        const ip = instance.privateIp;

        const res1 = await axios.post(`http://${ip}:8080/api/v1.0/machine`);
        const memoryCapacity = res1.data['memory_capacity'];

        const res2 = await axios.post(`http://${ip}:8080/api/v1.0/containers/`);
        const cur = res2.data['stats'].at(-1);
        const prev = res2.data['stats'].at(-2);

        const res3 = await axios.get(`http://${ip}:5000/check`);
        await axios.get(`http://${ip}:5000/clear`);

        function getInterval(current, previous) {
          const cur1 = new Date(current);
          const prev1 = new Date(previous);

          // ms -> ns.
          return (cur1.getTime() - prev1.getTime()) * 1000000;
        }

        const intervalNs = getInterval(cur['timestamp'], prev['timestamp']);

        const cpu =
          (cur['cpu']['usage']['total'] - prev['cpu']['usage']['total']) /
          intervalNs;

        const hotMemory = Math.floor(
          (cur['memory']['working_set'] * 100.0) / memoryCapacity,
        );
        const ramTotal = Math.floor(
          (cur['memory']['usage'] * 100.0) / memoryCapacity,
        );

        const intervalInSec = intervalNs / 1000000000;
        const txBps =
          (cur['network']['interfaces'].at(-1)['tx_bytes'] -
            prev['network']['interfaces'].at(-1)['tx_bytes']) /
          intervalInSec;
        const rxBps =
          (cur['network']['interfaces'].at(-1)['rx_bytes'] -
            prev['network']['interfaces'].at(-1)['rx_bytes']) /
          intervalInSec;

        instances.push({
          name: instance.name,
          publicIp: instance.publicIp,
          cpu,
          memoryCapacity,
          hotMemory,
          ramTotal,
          txBps,
          rxBps,
          pingpong: JSON.stringify(res3.data),
        });
      }
    }

    return { instances } as MonitorResDto;
  }
}
