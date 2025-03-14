import { UUID } from 'crypto';
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentTypeEnum } from './enums/payment-type.enum';
import { Field } from 'src/fields/field.entity';
import { Voucher } from 'src/vouchers/voucher.entity';
import { BookingService } from './booking-service.entity';
import { People } from 'src/people/people.entity';

@Entity()
@Unique(['startTime', 'endTime', 'field'])
@Check('"endTime" > "startTime"')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({
    type: 'date',
    nullable: false,
  })
  date: Date;

  @Column({
    type: 'time',
    nullable: false,
  })
  startTime: string;

  @Column({
    type: 'time',
    nullable: false,
  })
  endTime: string;

  @CreateDateColumn({
    type: 'timestamptz',
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    nullable: false,
  })
  updatedAt: Date;

  @Column({
    type: 'enum',
    enum: PaymentTypeEnum,
    nullable: false,
  })
  paymentType: PaymentTypeEnum;

  @Column({
    type: 'float',
    nullable: false,
  })
  price: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  pricePeak?: number;

  @Column({
    type: 'float',
    nullable: false,
  })
  finalPrice: number;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  isPaid: boolean;

  @ManyToOne(() => Field, (field) => field.bookings, {
    cascade: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  field: Field;

  @OneToMany(() => BookingService, (bookingService) => bookingService.booking)
  bookingServices?: BookingService[];

  @ManyToOne(() => Voucher, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  voucher?: Voucher;

  @ManyToOne(() => People, (people) => people.bookings, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: false,
  })
  player: People;
}
