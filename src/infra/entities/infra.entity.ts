import { InternalServerErrorException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsJSON, IsNotEmpty, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/user/entities/user.entity';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity()
export class Infra extends CoreEntity {
  @ApiProperty({
    description: 'Infra Identify Prefix',
  })
  @IsString()
  @Exclude()
  @Column({ unique: true })
  infraId: string;

  @Column()
  @IsNotEmpty({ message: 'Name is required for creating infra.' })
  @IsString()
  name: string;

  @Column('text')
  @Exclude()
  @IsJSON()
  desc: string;

  @ManyToOne(() => User, (user) => user.infras)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @BeforeInsert()
  async createInfraId(): Promise<void> {
    try {
      this.infraId = uuid();
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
