import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FacilityStatusEnum } from './enums/facility-status.enum';
import { People } from 'src/people/people.entity';
import { Field } from 'src/fields/field.entity';

@Entity()
export class Facility {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'time',
    nullable: false,
  })
  openTime: string;

  @Column({
    type: 'time',
    nullable: false,
  })
  closeTime: string;
  /**
   * Có thể sửa lại thành kinh độ vĩ độ nhưng để hiện thực sau
   */
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  location: string;

  @Column({
    type: 'enum',
    enum: FacilityStatusEnum,
    nullable: false,
    default: FacilityStatusEnum.DRAFT,
  })
  status: FacilityStatusEnum;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  thumbnail?: string;

  @Column({
    type: 'real',
    default: 0.0,
  })
  avgRating: number;

  @Column({
    type: 'integer',
    default: 0,
  })
  quantityRating: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => People, (people) => people.facilities)
  owner: People;

  @OneToMany(() => Field, (field) => field.facility)
  fields: Field[];
}
