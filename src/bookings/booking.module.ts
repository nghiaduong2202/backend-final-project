import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService as BookingServiceEntity } from './booking-service.entity';
import { BookingService } from './booking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { CreateProvider } from './providers/create.provider';
import { PeopleModule } from 'src/people/people.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, BookingServiceEntity]),
    PeopleModule,
  ],
  controllers: [BookingController],
  providers: [BookingService, CreateProvider],
})
export class BookingModule {}
