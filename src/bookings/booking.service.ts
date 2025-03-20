import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { CreateDraftProvider } from './providers/create-draft.provider';
import { CreateDraftBookingDto } from './dtos/create-draft-booking.dto';
import { DeleteDraftProvider } from './providers/delete-draft.provider';
import { GetByIdProvider } from './providers/get-by-id.provider';
import { UpdateFieldProvider } from './providers/update-field.provider';
import { UpdateServiceProvider } from './providers/update-service.provider';
import { UpdateFieldBookingDto } from './dtos/update-field-booking.dto';
import { UpdateServiceBookingDto } from './dtos/upadte-services-booking.dto';
import { PaymentProvider } from './providers/payment.provider';
import { Request } from 'express';
import { PaymentDto } from './dtos/payment.dto';
import { VnpayIpnProvider } from './providers/vnpay-ipn.provider';
import { GetByFieldProviders } from './providers/get-by-field.providers';
import { TransactionManagerProvider } from 'src/common/providers/transaction-manager.provider';

@Injectable()
export class BookingService {
  constructor(
    /**
     * inject transactionManagerProvider
     */
    private readonly transactionManagerProvider: TransactionManagerProvider,
  ) {}

  public async createDraft(
    createDraftBookingDto: CreateDraftBookingDto,
    playerId: UUID,
  ) {
    // return await this.createDraftProvider.createDraft(
    //   createDraftBookingDto,
    //   playerId,
    // );
  }

  public async deleteDraft(bookingId: UUID, playerId: UUID) {
    // return await this.deleteDraftProvider.deleteDraft(bookingId, playerId);
  }

  public async getById(bookingId: UUID) {
    // return await this.getByIdProvider.getById(bookingId);
  }

  public async updateField(
    updateFieldBookingDto: UpdateFieldBookingDto,
    bookingId: UUID,
    playerId: UUID,
  ) {
    // return await this.updateFieldProvider.updateField(
    //   updateFieldBookingDto,
    //   bookingId,
    //   playerId,
    // );
  }

  public async updateService(
    updateServiceBookingDto: UpdateServiceBookingDto,
    bookingId: UUID,
    playerId: UUID,
  ) {
    // return await this.updateServiceProvider.updateService(
    //   updateServiceBookingDto,
    //   bookingId,
    //   playerId,
    // );
  }

  public async payment(
    paymentDto: PaymentDto,
    bookingId: UUID,
    playerId: UUID,
    req: Request,
  ) {
    // return await this.paymentProvider.payment(
    //   paymentDto,
    //   bookingId,
    //   playerId,
    //   req,
    // );
  }

  public async vnpayIpn(req: Request) {
    // return await this.vnpayIpnProvider.vnpayIpn(req);
  }

  public async getByField(fieldId: number, date: Date) {
    // return await this.getByFieldProvider.getByField(fieldId, date);
  }
}
