import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FieldStatusEnum } from './enums/field-status.entity';
import { Facility } from 'src/facilities/facility.entity';
import { Sport } from 'src/sports/sport.entity';

@Entity()
export class Field {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'enum',
    enum: FieldStatusEnum,
    default: FieldStatusEnum.PENDING,
  })
  status: FieldStatusEnum;

  @Column({
    type: 'float',
    nullable: false,
    default: 0.0,
  })
  price: number;

  @Column({
    type: 'float',
    nullable: false,
    default: 0.0,
  })
  avgRating: number;

  @Column({
    type: 'integer',
    nullable: false,
    default: 0,
  })
  quantityRating: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  demenstion: string;

  @ManyToOne(() => Facility, (facility) => facility.fields)
  facility: Facility;

  @ManyToMany(() => Sport, {
    cascade: true,
  })
  @JoinTable({
    name: 'field_sport',
  })
  sports: Sport[];
}
