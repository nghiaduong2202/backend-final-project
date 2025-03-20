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
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BookingService {
  constructor(
    /**
     * inject create draft provider
     */
    private readonly createDraftProvider: CreateDraftProvider,
    /**
     * delete draft provider
     */
    private readonly deleteDraftProvider: DeleteDraftProvider,
    /**
     * inject get by id provider
     */
    private readonly getByIdProvider: GetByIdProvider,
    /**
     * inject update field provider
     */
    private readonly updateFieldProvider: UpdateFieldProvider,
    /**
     * inject update service provider
     */
    private readonly updateServiceProvider: UpdateServiceProvider,
    /**
     * inject payment provider
     */
    private readonly paymentProvider: PaymentProvider,
    /**
     * inject vnpay inp provider
     */
    private readonly vnpayIpnProvider: VnpayIpnProvider,
    /**
     * inject get by field provider
     */
    private readonly getByFieldProvider: GetByFieldProviders,
    /**
     * inject bookingRepository
     */
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  public async createDraft(
    createDraftBookingDto: CreateDraftBookingDto,
    playerId: UUID,
  ) {
    return await this.createDraftProvider.createDraft(
      createDraftBookingDto,
      playerId,
    );
  }

  public async deleteDraft(bookingId: UUID, playerId: UUID) {
    return await this.deleteDraftProvider.deleteDraft(bookingId, playerId);
  }

  public async getById(bookingId: UUID) {
    return await this.getByIdProvider.getById(bookingId);
  }

  public async updateField(
    updateFieldBookingDto: UpdateFieldBookingDto,
    bookingId: UUID,
    playerId: UUID,
  ) {
    return await this.updateFieldProvider.updateField(
      updateFieldBookingDto,
      bookingId,
      playerId,
    );
  }

  public async updateService(
    updateServiceBookingDto: UpdateServiceBookingDto,
    bookingId: UUID,
    playerId: UUID,
  ) {
    return await this.updateServiceProvider.updateService(
      updateServiceBookingDto,
      bookingId,
      playerId,
    );
  }

  public async payment(
    paymentDto: PaymentDto,
    bookingId: UUID,
    playerId: UUID,
    req: Request,
  ) {
    return await this.paymentProvider.payment(
      paymentDto,
      bookingId,
      playerId,
      req,
    );
  }

  public async vnpayIpn(req: Request) {
    return await this.vnpayIpnProvider.vnpayIpn(req);
  }

  public async getByField(fieldId: number, date: Date) {
    return await this.getByFieldProvider.getByField(fieldId, date);
  }

  public async getByFacility(facilityId: UUID) {
    return await this.bookingRepository.find({
      where: {
        field: {
          fieldGroup: {
            facility: {
              id: facilityId,
            },
          },
        },
      },
      order: {
        updatedAt: 'DESC',
      },
      relations: {
        sport: true,
      },
    });
  }

  public async getByOwner(ownerId: UUID) {
    return await this.bookingRepository.find({
      where: {
        field: {
          fieldGroup: {
            facility: {
              owner: {
                id: ownerId,
              },
            },
          },
        },
      },
      order: {
        updatedAt: 'DESC',
      },
      relations: {
        sport: true,
      },
    });
  }

  public async getByPlayer(playerId: UUID) {
    return await this.bookingRepository.find({
      where: {
        player: {
          id: playerId,
        },
      },
      order: {
        updatedAt: 'DESC',
      },
      relations: {
        sport: true,
      },
    });
  }
}
