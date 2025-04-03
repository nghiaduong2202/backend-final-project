import { Injectable } from '@nestjs/common';
import { UpdateBookingSlotDto } from './dto/update-booking-slot.dto';
import { QueryRunner } from 'typeorm';
import { BookingSlot } from './booking-slot.entity';
import { Booking } from 'src/bookings/booking.entity';
import { Field } from 'src/fields/field.entity';

@Injectable()
export class BookingSlotService {
  public async createWithTransaction(
    field: Field,
    date: Date,
    booking: Booking,
    queryRunner: QueryRunner,
  ) {
    const bookingSlot = queryRunner.manager.create(BookingSlot, {
      field,
      date,
      booking,
    });

    return await queryRunner.manager.save(bookingSlot);
  }

  findAll() {
    return `This action returns all bookingSlot`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bookingSlot`;
  }

  update(id: number, updateBookingSlotDto: UpdateBookingSlotDto) {
    return `This action updates a #${id} bookingSlot`;
  }

  remove(id: number) {
    return `This action removes a #${id} bookingSlot`;
  }
}
