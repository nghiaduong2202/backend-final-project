import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Facility } from './facility.entity';

@Entity()
export class FacilityImage {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  url: string;

  @ManyToOne(() => Facility, (facility) => facility.facilityImages, {
    cascade: true,
    nullable: false,
  })
  @JoinColumn()
  facility: Facility;
}
