import { BadRequestException } from '@nestjs/common';
import { Facility } from 'src/facilities/facility.entity';
import { Sport } from 'src/sports/sport.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['name', 'facility'])
export class Service {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'integer',
    nullable: false,
  })
  price: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'integer',
    nullable: false,
    default: 0,
  })
  amount: number;

  @OneToOne(() => Sport, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn()
  sport: Sport;

  @ManyToOne(() => Facility, (facility) => facility.services, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  facility: Facility;

  @BeforeUpdate()
  @BeforeInsert()
  beforeUpdateAndInsert() {
    /**
     * amount must be more than or equal to 0
     */
    if (this.amount < 0) {
      throw new BadRequestException(
        'Amount of service must be more than or equal to 0',
      );
    }
  }
}
