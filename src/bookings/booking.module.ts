import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService as BookingServiceEntity } from './booking-service.entity';
import { BookingService } from './booking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { PeopleModule } from 'src/people/people.module';
import { CreateDraftProvider } from './providers/create-draft.provider';
import { SportModule } from 'src/sports/sport.module';
import { FieldModule } from 'src/fields/field.module';
import { UpdateFieldProvider } from './providers/update-field.provider';
import { UpdateServiceProvider } from './providers/update-service.provider';
import { DeleteDraftProvider } from './providers/delete-draft.provider';
import { PaymentProvider } from './providers/payment.provider';
import { GetByIdProvider } from './providers/get-by-id.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, BookingServiceEntity]),
    PeopleModule,
    SportModule,
    FieldModule,
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
  ],
})
export class BookingModule {}
