import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Booking } from './booking.entity';
import { Service } from 'src/services/service.entiry';
import { UUID } from 'crypto';

@Entity()
export class BookingService {
  @PrimaryColumn()
  bookingId: UUID;

  @PrimaryColumn()
  serviceId: number;

  @ManyToOne(() => Booking, (booking) => booking.bookingServices, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'bookingId',
  })
  booking: Booking;

  @ManyToOne(() => Service, (service) => service.bookingServices, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'serviceId',
  })
  service: Service;

  @Column({
    nullable: false,
    type: 'integer',
    default: 1,
  })
  quantity: number;
}
