import { UUID } from 'crypto';
import { Facility } from 'src/facilities/facility.entity';
import { Field } from 'src/fields/field.entity';
import { Sport } from 'src/sports/sport.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
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
  peakStartTime?: string;

  @Column({
    type: 'time',
    nullable: true,
  })
  peakEndTime?: string;

  @Column({
    type: 'integer',
    nullable: true,
  })
  priceIncrease?: number;

  @ManyToOne(() => Facility, (facility) => facility.fieldGroups, {
    cascade: true,
    nullable: false,
  })
  @JoinColumn()
  facility: Facility;

  @ManyToMany(() => Sport, (sports) => sports.fieldGroups)
  @JoinTable({
    name: 'field-group-sport',
  })
  sports: Sport[];

  @OneToMany(() => Field, (fields) => fields.fieldGroup)
  fields: Field[];
}
