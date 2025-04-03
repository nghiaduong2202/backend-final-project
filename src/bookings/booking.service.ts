import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { CreateDraftBookingDto } from './dtos/create-draft-booking.dto';
import { TransactionManagerProvider } from 'src/common/providers/transaction-manager.provider';
import {
  Between,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  QueryRunner,
  Repository,
} from 'typeorm';
import { PersonService } from 'src/people/person.service';
import { FieldService } from 'src/fields/field.service';
import { SportService } from 'src/sports/sport.service';
import { isBetweenTime } from 'src/common/utils/is-between-time';
import { Booking } from './booking.entity';
import { duration } from 'src/common/utils/duration';
import { durationOverlapTime } from 'src/common/utils/duration-overlap-time';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentStatusEnum } from 'src/payments/enums/payment-status.enum';
import { BookingSlot } from 'src/booking-slots/booking-slot.entity';
import { BookingSlotService } from 'src/booking-slots/booking-slot.service';
import { PaymentService } from 'src/payments/payment.service';
import { UpdateServiceBookingDto } from './dtos/upadte-services-booking.dto';
import { CreateAdditionalServiceDto } from 'src/additional-serrvices/dto/create-additional-service.dto';

@Injectable()
export class BookingService {
  constructor(
    /**
     * inject transactionManagerProvider
     */
    private readonly transactionManagerProvider: TransactionManagerProvider,
    /**
     * inject personService
     */
    private readonly personService: PersonService,
    /**
     * inject fieldService
     */
    private readonly fieldService: FieldService,
    /**
     * inject sportService
     */
    private readonly sportService: SportService,
    /**
     * inject bookingRepository
     */
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    /**
     * inject bookingSlotService
     */
    private readonly bookingSlotService: BookingSlotService,
    /**
     * inject paymentService
     */
    private readonly paymentService: PaymentService,
  ) {}
  public async createDraft(
    createDraftBookingDto: CreateDraftBookingDto,
    playerId: UUID,
  ) {
    if (createDraftBookingDto.bookingSlots.length === 0)
      throw new BadRequestException('You must choose at least one field');

    const firstField = await this.fieldService.findOneById(
      createDraftBookingDto.bookingSlots[0].fieldId,
      ['fieldGroup.facility'],
    );

    const fieldGroupId = firstField.fieldGroup.id;

    const facility = firstField.fieldGroup.facility;

    // check startTime and endTime between openTime1 and closeTime1
    isBetweenTime(
      createDraftBookingDto.startTime,
      createDraftBookingDto.endTime,
      facility.openTime1,
      facility.closeTime1,
      'Booking time not between open time and close time',
    );

    // check startTime and endTime between openTime2 and closeTime2
    if (facility.openTime2 && facility.closeTime2) {
      isBetweenTime(
        createDraftBookingDto.startTime,
        createDraftBookingDto.endTime,
        facility.openTime2,
        facility.closeTime2,
        'Booking time not between open time and close time',
      );
    }

    // check startTime and endTime between openTime3 and closeTime3
    if (facility.openTime3 && facility.closeTime3) {
      isBetweenTime(
        createDraftBookingDto.startTime,
        createDraftBookingDto.endTime,
        facility.openTime3,
        facility.closeTime3,
        'Booking time not between open time and close time',
      );
    }

    return await this.transactionManagerProvider.transaction(
      async (queryRunner: QueryRunner) => {
        // get player by id
        const player = await this.personService.findOneByIdWithTransaction(
          playerId,
          queryRunner,
        );

        // get sport by id
        const sport = await this.sportService.findOneByIdWithTransaction(
          createDraftBookingDto.sportId,
          queryRunner,
        );

        // create booking
        const booking = queryRunner.manager.create(Booking, {
          ...createDraftBookingDto,
          player,
          sport,
        });

        const bookingSlots: BookingSlot[] = [];

        let fieldPrice = 0;

        // check and create bookingSlots
        for (const bookingSlot of createDraftBookingDto.bookingSlots) {
          // get field by id
          const field = await this.fieldService.findOneWithTransaction(
            bookingSlot.fieldId,
            queryRunner,
            ['fieldGroup.facility', 'fieldGroup.sports'],
          );

          // check fields have same field group
          if (field.fieldGroup.id !== fieldGroupId) {
            throw new BadRequestException('Fields must have same field group');
          }

          // check field includes sport
          if (
            !field.fieldGroup.sports.find(
              (sport) => sport.id === createDraftBookingDto.sportId,
            )
          ) {
            throw new BadRequestException('Field does not include this sport');
          }

          // check not overlap with other booking
          await this.checkOverlapBookingsWithTransaction(
            bookingSlot.fieldId,
            bookingSlot.date,
            createDraftBookingDto.startTime,
            createDraftBookingDto.endTime,
            queryRunner,
          );

          // create bookingSlot
          const newBookingSlot =
            await this.bookingSlotService.createWithTransaction(
              field,
              bookingSlot.date,
              booking,
              queryRunner,
            );

          bookingSlots.push(newBookingSlot);

          const playTime = duration(
            createDraftBookingDto.endTime,
            createDraftBookingDto.startTime,
          );

          fieldPrice = field.fieldGroup.basePrice * playTime;

          if (field.fieldGroup.numberOfPeaks > 0) {
            const overlapPeak = durationOverlapTime(
              field.fieldGroup.peakStartTime1!,
              field.fieldGroup.peakEndTime1!,
              createDraftBookingDto.startTime,
              createDraftBookingDto.endTime,
            );
            fieldPrice += overlapPeak * field.fieldGroup.priceIncrease1!;
          }

          if (field.fieldGroup.numberOfPeaks > 1) {
            const overlapPeak = durationOverlapTime(
              field.fieldGroup.peakStartTime2!,
              field.fieldGroup.peakEndTime2!,
              createDraftBookingDto.startTime,
              createDraftBookingDto.endTime,
            );
            fieldPrice += overlapPeak * field.fieldGroup.priceIncrease2!;
          }

          if (field.fieldGroup.numberOfPeaks > 2) {
            const overlapPeak = durationOverlapTime(
              field.fieldGroup.peakStartTime3!,
              field.fieldGroup.peakEndTime3!,
              createDraftBookingDto.startTime,
              createDraftBookingDto.endTime,
            );
            fieldPrice += overlapPeak * field.fieldGroup.priceIncrease3!;
          }
        }

        // create payment
        const payment = await this.paymentService.createWithTransaction(
          fieldPrice,
          booking,
          queryRunner,
        );

        booking.payment = payment;
        booking.bookingSlots = bookingSlots;

        return booking;
      },
    );
  }

  private async checkOverlapBookingsWithTransaction(
    fieldId: number,
    date: Date,
    startTime: string,
    endTime: string,
    queryRunner: QueryRunner,
  ) {
    const overlapBooking = await queryRunner.manager.findOne(Booking, {
      where: [
        {
          bookingSlots: {
            field: {
              id: fieldId,
            },
            date: date,
          },
          startTime: Between(startTime, endTime),
          payment: {
            status: Not(PaymentStatusEnum.CANCELLED),
          },
        },
        {
          bookingSlots: {
            field: {
              id: fieldId,
            },
            date: date,
          },
          payment: {
            status: Not(PaymentStatusEnum.CANCELLED),
          },
          endTime: Between(startTime, endTime),
        },
        {
          bookingSlots: {
            field: {
              id: fieldId,
            },
            date: date,
          },
          payment: {
            status: Not(PaymentStatusEnum.CANCELLED),
          },
          startTime: LessThanOrEqual(startTime),
          endTime: MoreThanOrEqual(endTime),
        },
      ],
    });

    if (overlapBooking) {
      throw new BadRequestException(
        'Booking time overlap with another booking',
      );
    }
  }

  // public async updateService(
  //   createAdditionalServiceDto: CreateAdditionalServiceDto[],
  //   bookingId: UUID,
  //   playerId: UUID,
  // ) {
  //   return await this.transactionManagerProvider.transaction(
  //     async (queryRunner: QueryRunner) => {
  //       // get booking by id
  //       const booking = await this.findOneWithTransaction(
  //         bookingId,
  //         queryRunner,
  //         ['player', 'sport'],
  //       );

  //       // check permission
  //       if (booking.player.id !== playerId) {
  //         throw new NotAcceptableException(
  //           'You do not have permission to update this booking',
  //         );
  //       }

  //       if (booking.bookingServices) {
  //         for (const oldService of booking.bookingServices) {
  //           await queryRunner.manager.delete(BookingServiceEntity, oldService);
  //         }
  //       }
  //       delete booking.bookingServices;
  //       let servicePrice = 0;
  //       const newBookingServices: BookingServiceEntity[] = [];
  //       // check overlap and save new services
  //       for (const newService of updateServiceBookingDto.bookingServicesData) {
  //         const service = await this.serviceService.findOneWithTransaction(
  //           newService.serviceId,
  //           queryRunner,
  //           ['facility', 'sport'],
  //         );
  //         // check service have same facility with field
  //         if (service.facility.id !== booking.field.fieldGroup.facility.id) {
  //           throw new BadRequestException(
  //             'Service must have same facility with field',
  //           );
  //         }
  //         // check service have same sport with booking
  //         if (service.sport.id !== booking.sport.id) {
  //           throw new BadRequestException(
  //             'Service must have same sport with booking',
  //           );
  //         }
  //         const overlapBookingServices = await queryRunner.manager.find(
  //           BookingServiceEntity,
  //           {
  //             where: [
  //               {
  //                 service: {
  //                   id: newService.serviceId,
  //                 },
  //                 booking: {
  //                   date: booking.date,
  //                   status: Not(BookingStatusEnum.CANCELLED),
  //                   startTime: Between(booking.startTime, booking.endTime),
  //                 },
  //               },
  //               {
  //                 service: {
  //                   id: newService.serviceId,
  //                 },
  //                 booking: {
  //                   date: booking.date,
  //                   status: Not(BookingStatusEnum.CANCELLED),
  //                   endTime: Between(booking.startTime, booking.endTime),
  //                 },
  //               },
  //               {
  //                 service: {
  //                   id: newService.serviceId,
  //                 },
  //                 booking: {
  //                   date: booking.date,
  //                   status: Not(BookingStatusEnum.CANCELLED),
  //                   startTime: LessThanOrEqual(booking.startTime),
  //                   endTime: MoreThanOrEqual(booking.endTime),
  //                 },
  //               },
  //             ],
  //           },
  //         );
  //         const amountOfServiceRented = overlapBookingServices.reduce(
  //           (prev, curr) => prev + curr.quantity,
  //           0,
  //         );
  //         if (amountOfServiceRented + newService.amount > service.amount) {
  //           throw new BadRequestException(
  //             `Service ${newService.serviceId} is out of stock`,
  //           );
  //         }
  //         servicePrice += service.price * newService.amount;
  //         const newBookingService = queryRunner.manager.create(
  //           BookingServiceEntity,
  //           {
  //             bookingId: booking.id,
  //             serviceId: service.id,
  //             quantity: newService.amount,
  //           },
  //         );
  //         await queryRunner.manager.save(newBookingService);
  //         newBookingServices.push(newBookingService);
  //       }
  //       // update price
  //       booking.servicePrice = servicePrice;
  //       await queryRunner.manager.save(booking);
  //       booking.bookingServices = newBookingServices;
  //       return booking;
  //     },
  //   );
  // }

  public async findOneWithTransaction(
    bookingId: UUID,
    queryRunner: QueryRunner,
    relations?: string[],
  ) {
    const booking = await queryRunner.manager.findOne(Booking, {
      where: {
        id: bookingId,
      },
      relations: relations,
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  // public async deleteDraft(bookingId: UUID, playerId: UUID) {
  //   const booking = await this.getById(bookingId);
  //   if (booking.player.id !== playerId) {
  //     throw new BadRequestException(
  //       'You do not have permission to delete this booking',
  //     );
  //   }
  //   if (booking.status !== BookingStatusEnum.DRAFT) {
  //     throw new BadRequestException('You can only delete draft booking');
  //   }
  //   // await this.bookingRepository.delete(booking);
  //   return {
  //     message: 'Delete draft booking successfully',
  //   };
  // }
  // public async getById(bookingId: UUID) {
  //   const booking = await this.bookingRepository.findOne({
  //     where: {
  //       id: bookingId,
  //     },
  //     relations: {
  //       // bookingServices: true,
  //       player: true,
  //       // field: {
  //       //   fieldGroup: true,
  //       // },
  //     },
  //   });
  //   if (!booking) {
  //     throw new NotFoundException('Booking not found');
  //   }
  //   return booking;
  // }

  // public async updateField(
  //   updateFieldBookingDto: UpdateFieldBookingDto,
  //   bookingId: UUID,
  //   playerId: UUID,
  // ) {
  //   return this.transactionManagerProvider.transaction(
  //     async (queryRunner: QueryRunner) => {
  //       const booking = await this.findOneWithTransaction(
  //         bookingId,
  //         queryRunner,
  //         [
  //           'player',
  //           'field',
  //           'field.fieldGroup.facility',
  //           'bookingServices',
  //           'sport',
  //         ],
  //       );
  //       // booking change only with status is draft
  //       if (booking.status !== BookingStatusEnum.DRAFT) {
  //         throw new BadRequestException('You can only update draft booking');
  //       }
  //       // check player have permission to update field
  //       if (booking.player.id !== playerId) {
  //         throw new BadRequestException(
  //           'You do not have permission to update this booking',
  //         );
  //       }
  //       // if (booking.field.id === updateFieldBookingDto.fieldId) {
  //       //   return {
  //       //     message: 'Same field, no need to update',
  //       //   };
  //       // }
  //       // await this.checkOverlapBookings(
  //       //   updateFieldBookingDto.fieldId,
  //       //   booking.date,
  //       //   booking.startTime,
  //       //   booking.endTime,
  //       //   queryRunner,
  //       // );
  //       // get new field
  //       const newField = await this.fieldService.getByIdWithTransaction(
  //         updateFieldBookingDto.fieldId,
  //         queryRunner,
  //       );
  //       // check new field have same facility with old field
  //       // if (
  //       //   newField.fieldGroup.facility.id !==
  //       //   booking.field.fieldGroup.facility.id
  //       // ) {
  //       //   throw new BadRequestException(
  //       //     'New field must have same facility with old field',
  //       //   );
  //       // }
  //       // check field have spoprt
  //       if (
  //         !newField.fieldGroup.sports.find(
  //           (sport) => sport.id === booking.sport.id,
  //         )
  //       ) {
  //         throw new BadRequestException(
  //           'New field does not have same sport with old field',
  //         );
  //       }
  //       // calculate field price
  //       // const playTime = duration(booking.startTime, booking.endTime);
  //       // const newFieldPrice = playTime * newField.fieldGroup.basePrice;
  //       // if (
  //       //   newField.fieldGroup.peakStartTime &&
  //       //   newField.fieldGroup.peakEndTime &&
  //       //   newField.fieldGroup.priceIncrease
  //       // ) {
  //       //   const overlapPeak = durationOverlapTime(
  //       //     newField.fieldGroup.peakStartTime,
  //       //     newField.fieldGroup.peakEndTime,
  //       //     booking.startTime,
  //       //     booking.endTime,
  //       //   );
  //       //   newFieldPrice += overlapPeak * newField.fieldGroup.priceIncrease;
  //       // }
  //       // update field
  //       // booking.field = newField;
  //       // booking.fieldPrice = newFieldPrice;
  //       return await queryRunner.manager.save(booking);
  //     },
  //   );
  // }
  // public async payment(
  //   paymentDto: PaymentDto,
  //   bookingId: UUID,
  //   playerId: UUID,
  //   req: Request,
  // ) {
  //   return await this.paymentProvider.payment(
  //     paymentDto,
  //     bookingId,
  //     playerId,
  //     req,
  //   );
  // }
  // public async vnpayIpn(req: Request) {
  //   return await this.vnpayIpnProvider.vnpayIpn(req);
  // }
}
