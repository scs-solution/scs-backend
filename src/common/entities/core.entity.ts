import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, PrimaryGeneratedColumn } from 'typeorm';

export class CoreEntity extends BaseEntity {
  @ApiProperty({
    description: 'id',
  })
  @PrimaryGeneratedColumn()
  id: number;
}
