import { BadRequestException, Injectable } from '@nestjs/common';
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
import { isBefore } from 'src/utils/is-before';
import { QueryRunner } from 'typeorm';
import { PeopleService } from 'src/people/people.service';
import { FieldService } from 'src/fields/field.service';
import { SportService } from 'src/sports/sport.service';

@Injectable()
export class BookingService {
  constructor(
    /**
     * inject transactionManagerProvider
     */
    private readonly transactionManagerProvider: TransactionManagerProvider,
    /**
     * inject peopleService
     */
    private readonly peopleService: PeopleService,
    /**
     * inject fieldService
     */
    private readonly fieldService: FieldService,
    /**
     * inject sportService
     */
    private readonly sportService: SportService,
  ) {}

  public async createDraft(
    createDraftBookingDto: CreateDraftBookingDto,
    playerId: UUID,
  ) {
    // check start time before end time
    isBefore(
      createDraftBookingDto.startTime,
      createDraftBookingDto.endTime,
      'Start time must be before end time',
    );

    await this.transactionManagerProvider.transaction(
      async (queryRunner: QueryRunner) => {
        // get player by id
        const player = await this.peopleService.getByIdWithTransaction(
          playerId,
          queryRunner,
        );

        // get field by id
        const field = await this.fieldService.getByIdWithTransaction(
          createDraftBookingDto.fieldId,
          queryRunner,
        );

        // check field includes sport
        if (
          !field.fieldGroup.sports.find(
            (sport) => sport.id === createDraftBookingDto.sportId,
          )
        ) {
          throw new BadRequestException('Field does not include this sport');
        }

        // check startTime and endTime between openTime and closeTime
        

        // check not overlap with other booking
        // create draft booking
      },
    );
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
