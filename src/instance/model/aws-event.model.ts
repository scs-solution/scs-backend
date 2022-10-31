export class AWSEventBridgeEventEC2Detail {
  'spot-instance-request-id'?: string;
  'instance-id': string;
  'instance-action'?: string;
}

export class AWSEventBridgeEvent {
  version: string;
  id: string;
  'detail-type': string;
  source: string;
  account: string;
  time: string;
  region: string;
  resources: [string];
  detail: AWSEventBridgeEventEC2Detail;
}
