import { InfraInstance } from './infra.instance';

export class InfraDescription {
  name: string;
  endpoint?: string;
  instances?: InfraInstance[];
}
