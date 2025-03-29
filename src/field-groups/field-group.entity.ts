import { UUID } from 'crypto';
import { Facility } from 'src/facilities/facility.entity';
import { Field } from 'src/fields/field.entity';
import { Sport } from 'src/sports/sport.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['name', 'facility'])
export class FieldGroup {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  dimension: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  surface: string;

  @Column({
    type: 'integer',
    nullable: false,
  })
  basePrice: number;

  @Column({
    type: 'time',
    nullable: true,
  })
  peakStartTime1?: string;

  @Column({
    type: 'time',
    nullable: true,
  })
  peakEndTime1?: string;

  @Column({
    type: 'integer',
    nullable: true,
  })
  priceIncrease1?: number;
  @Column({
    type: 'time',
    nullable: true,
  })
  peakStartTime2?: string;

  @Column({
    type: 'time',
    nullable: true,
  })
  peakEndTime2?: string;

  @Column({
    type: 'integer',
    nullable: true,
  })
  priceIncrease2?: number;
  @Column({
    type: 'time',
    nullable: true,
  })
  peakStartTime3?: string;

  @Column({
    type: 'time',
    nullable: true,
  })
  peakEndTime3?: string;

  @Column({
    type: 'integer',
    nullable: true,
  })
  priceIncrease3?: number;

  @Column({
    type: 'integer',
    nullable: false,
    default: 0,
  })
  numberOfPeaks: number;

  @OneToMany(() => Field, (field) => field.fieldGroup)
  fields: Field[];

  @ManyToOne(() => Facility, (facility) => facility.fieldGroups, {
    onDelete: 'CASCADE',
  })
  facility: Facility;

  @ManyToMany(() => Sport)
  @JoinTable()
  sports: Sport[];
}
