import { UUID } from 'crypto';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookingStatusEnum } from './enums/booking-status.enum';
import { Voucher } from 'src/vouchers/voucher.entity';
import { Person } from 'src/people/person.entity';
import { Sport } from 'src/sports/sport.entity';
import { BookingSlot } from 'src/booking-slots/booking-slot.entity';
import { isBefore } from 'src/common/utils/is-before';
import { Payment } from 'src/payments/payment.entity';
import { AdditionalService } from 'src/additional-serrvices/additional-service.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

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

  @ManyToOne(() => Voucher, (voucher) => voucher.bookings, {
    nullable: true,
  })
  @JoinColumn()
  voucher?: Voucher;

  @ManyToOne(() => Person, (person) => person.bookings, {
    nullable: false,
  })
  @JoinColumn()
  player: Person;

  @ManyToOne(() => Sport, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn()
  sport: Sport;

  @OneToMany(() => BookingSlot, (bookingSlot) => bookingSlot.booking)
  bookingSlots: BookingSlot[];

  @OneToOne(() => Payment, (payment) => payment.booking)
  payment: Payment;

  @OneToMany(
    () => AdditionalService,
    (additionalService) => additionalService.booking,
  )
  additionalServices: AdditionalService[];

  @BeforeInsert()
  beforeInsert() {
    isBefore(
      this.startTime,
      this.endTime,
      'Start time must be more than end time',
    );
  }
}
