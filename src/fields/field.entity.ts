import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { FieldStatusEnum } from './enums/field-status.entity';
import { FieldGroup } from 'src/field-groups/field-group.entity';
import { Booking } from 'src/bookings/booking.entity';

@Entity()
@Unique(['name', 'fieldGroup'])
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

  @ManyToOne(() => FieldGroup, (fieldGroup) => fieldGroup.fields, {
    cascade: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  fieldGroup: FieldGroup;

  @OneToMany(() => Booking, (booking) => booking.field)
  bookings: Booking[];
}
