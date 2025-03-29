import { UUID } from 'crypto';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaymentStatusEnum } from './enums/payment-status.enum';
import { Booking } from 'src/bookings/booking.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({
    type: 'integer',
    nullable: false,
  })
  fieldPrice: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  servicePrice?: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  discount?: number;

  @Column({
    type: 'enum',
    enum: PaymentStatusEnum,
    default: PaymentStatusEnum.UNPAID,
    nullable: false,
  })
  status: PaymentStatusEnum;

  @OneToOne(() => Booking, (booking) => booking.payment, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn()
  booking: Booking;
}
