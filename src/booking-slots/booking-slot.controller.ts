import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BookingSlotService } from './booking-slot.service';
import { CreateBookingSlotDto } from './dto/create-booking-slot.dto';
import { UpdateBookingSlotDto } from './dto/update-booking-slot.dto';

@Controller('booking-slot')
export class BookingSlotController {
  constructor(private readonly bookingSlotService: BookingSlotService) {}

  @Get()
  findAll() {
    return this.bookingSlotService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingSlotService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingSlotService.remove(+id);
  }
}
