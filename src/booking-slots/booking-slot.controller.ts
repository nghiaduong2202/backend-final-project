import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BookingSlotService } from './booking-slot.service';
import { CreateBookingSlotDto } from './dto/create-booking-slot.dto';
import { UpdateBookingSlotDto } from './dto/update-booking-slot.dto';

@Controller('booking-slot')
export class BookingSlotController {
  constructor(private readonly bookingSlotService: BookingSlotService) {}

  @Post()
  create(@Body() createBookingSlotDto: CreateBookingSlotDto) {
    return this.bookingSlotService.create(createBookingSlotDto);
  }

  @Get()
  findAll() {
    return this.bookingSlotService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingSlotService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingSlotDto: UpdateBookingSlotDto) {
    return this.bookingSlotService.update(+id, updateBookingSlotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingSlotService.remove(+id);
  }
}
