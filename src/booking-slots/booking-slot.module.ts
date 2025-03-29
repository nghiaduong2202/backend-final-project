import { Module } from '@nestjs/common';
import { BookingSlotService } from './booking-slot.service';
import { BookingSlotController } from './booking-slot.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingSlot } from './booking-slot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookingSlot])],
  controllers: [BookingSlotController],
  providers: [BookingSlotService],
})
export class BookingSlotModule {}
