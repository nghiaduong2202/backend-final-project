import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { PaymentProvider } from './providers/payment.provider';
import { ConfigModule } from '@nestjs/config';
import { VnpayIpnProvider } from './providers/vnpay-ipn.provider';
import { BookingScheduleProvider } from './providers/booking-schedule.provider';
import { PersonModule } from 'src/people/person.module';
import { FieldModule } from 'src/fields/field.module';
import { SportModule } from 'src/sports/sport.module';
import { CommonModule } from 'src/common/common.module';
import { ServiceModule } from 'src/services/service.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    ConfigModule,
    PersonModule,
    FieldModule,
    SportModule,
    CommonModule,
    ServiceModule,
  ],
  controllers: [BookingController],
  providers: [
    BookingService,
    PaymentProvider,
    VnpayIpnProvider,
    BookingScheduleProvider,
  ],
})
export class BookingModule {}
