import { Injectable } from '@nestjs/common';
import { CreateBookingSlotDto } from './dto/create-booking-slot.dto';
import { UpdateBookingSlotDto } from './dto/update-booking-slot.dto';

@Injectable()
export class BookingSlotService {
  create(createBookingSlotDto: CreateBookingSlotDto) {
    return 'This action adds a new bookingSlot';
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
