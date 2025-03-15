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
  UpdateDateColumn,
} from 'typeorm';
import { PaymentTypeEnum } from './enums/payment-type.enum';
import { Field } from 'src/fields/field.entity';
import { Voucher } from 'src/vouchers/voucher.entity';
import { BookingService } from './booking-service.entity';
import { People } from 'src/people/people.entity';
import { Sport } from 'src/sports/sport.entity';
import { BookingStatusEnum } from './enums/booking-status.enum';

@Entity()
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
    enum: BookingStatusEnum,
    nullable: false,
    default: BookingStatusEnum.DRAFT,
  })
  status: BookingStatusEnum;

  @Column({
    type: 'enum',
    enum: PaymentTypeEnum,
    nullable: true,
  })
  paymentType?: PaymentTypeEnum;

  @Column({
    type: 'integer',
    nullable: false,
    default: 0,
  })
  fieldPrice: number;

  @Column({
    type: 'integer',
    nullable: false,
    default: 0,
  })
  servicePrice: number;

  @Column({
    type: 'integer',
    nullable: false,
    default: 0,
  })
  discountAmount: number;

  @ManyToOne(() => Field, (field) => field.bookings, {
    cascade: true,
    nullable: false,
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
  @JoinColumn()
  player: People;

  @ManyToOne(() => Sport, {
    cascade: true,
    nullable: false,
  })
  @JoinColumn()
  sport: Sport;
}
