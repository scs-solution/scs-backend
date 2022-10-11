import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class CoreEntity extends BaseEntity {
  @ApiProperty({
    description: 'id',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Created At',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Update At',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
