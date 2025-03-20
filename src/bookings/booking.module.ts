import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService as BookingServiceEntity } from './booking-service.entity';
import { BookingService } from './booking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { CreateDraftProvider } from './providers/create-draft.provider';
import { UpdateFieldProvider } from './providers/update-field.provider';
import { UpdateServiceProvider } from './providers/update-service.provider';
import { DeleteDraftProvider } from './providers/delete-draft.provider';
import { PaymentProvider } from './providers/payment.provider';
import { GetByIdProvider } from './providers/get-by-id.provider';
import { ConfigModule } from '@nestjs/config';
import { VnpayIpnProvider } from './providers/vnpay-ipn.provider';
import { BookingScheduleProvider } from './providers/booking-schedule.provider';
import { GetByFieldProviders } from './providers/get-by-field.providers';
import { Facility } from 'src/facilities/facility.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, BookingServiceEntity]),
    ConfigModule,
    Facility,
  ],
  controllers: [BookingController],
  providers: [
    BookingService,
    CreateDraftProvider,
    UpdateFieldProvider,
    UpdateServiceProvider,
    DeleteDraftProvider,
    PaymentProvider,
    GetByIdProvider,
    VnpayIpnProvider,
    BookingScheduleProvider,
    GetByFieldProviders,
  ],
})
export class BookingModule {}
