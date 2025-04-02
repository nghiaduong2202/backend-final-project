import { PartialType } from '@nestjs/swagger';
import { CreateBookingSlotDto } from './create-booking-slot.dto';

export class UpdateBookingSlotDto extends PartialType(CreateBookingSlotDto) {}
