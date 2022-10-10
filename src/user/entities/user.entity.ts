import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends CoreEntity {
  @ApiProperty({
    description: 'User Id',
    required: true,
  })
  @IsNotEmpty({ message: 'User id is required for register.' })
  @Column({ unique: true })
  userId: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  @Exclude()
  privateKey: string;

  @Column({ nullable: true })
  @Exclude()
  refreshToken?: string;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async checkPassword(plain: string): Promise<boolean> {
    return bcrypt.compare(plain, this.password);
  }
}
