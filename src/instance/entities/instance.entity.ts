import { CoreEntity } from 'src/common/entities/core.entity';
import { Infra } from 'src/infra/entities/infra.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Instance extends CoreEntity {
  @Column()
  instanceId: string;

  @ManyToOne(() => Infra, (infra) => infra.instances)
  @JoinColumn({ name: 'infraId' })
  infra: Infra;

  @Column()
  infraId: number;
}
