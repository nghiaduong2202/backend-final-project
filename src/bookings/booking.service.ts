import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { CreateDraftBookingDto } from './dtos/create-draft-booking.dto';
import { UpdateFieldBookingDto } from './dtos/update-field-booking.dto';
import { UpdateServiceBookingDto } from './dtos/upadte-services-booking.dto';
import { Request } from 'express';
import { PaymentDto } from './dtos/payment.dto';
import { TransactionManagerProvider } from 'src/common/providers/transaction-manager.provider';
import { isBefore } from 'src/common/utils/is-before';
import {
  Between,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  QueryRunner,
  Repository,
} from 'typeorm';
import { PeopleService } from 'src/people/people.service';
import { FieldService } from 'src/fields/field.service';
import { SportService } from 'src/sports/sport.service';
import { isBetweenTime } from 'src/common/utils/is-between-time';
import { Booking } from './booking.entity';
import { BookingStatusEnum } from './enums/booking-status.enum';
import { duration } from 'src/common/utils/duration';
import { durationOverlapTime } from 'src/common/utils/duration-overlap-time';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceService } from 'src/services/service.service';
import { BookingService as BookingServiceEntity } from './booking-service.entity';
import { PaymentProvider } from './providers/payment.provider';
import { VnpayIpnProvider } from './providers/vnpay-ipn.provider';

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
    /**
     * inject bookingRepository
     */
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    /**
     * inject serviceService
     */
    private readonly serviceService: ServiceService,
    /**
     * inject paymentProvider
     */
    private readonly paymentProvider: PaymentProvider,
    /**
     * inject vpayIpnProvider
     */
    private readonly vnpayIpnProvider: VnpayIpnProvider,
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

    return await this.transactionManagerProvider.transaction(
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

        // get sport by id
        const sport = await this.sportService.getByIdWithTransaction(
          createDraftBookingDto.sportId,
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
        isBetweenTime(
          createDraftBookingDto.startTime,
          createDraftBookingDto.endTime,
          field.fieldGroup.facility.openTime,
          field.fieldGroup.facility.closeTime,
          'Booking time not between open time and close time',
        );

        // check not overlap with other booking
        await this.checkOverlapBookings(
          createDraftBookingDto.fieldId,
          createDraftBookingDto.date,
          createDraftBookingDto.startTime,
          createDraftBookingDto.endTime,
          queryRunner,
        );

        // create draft booking
        const playTime = duration(
          createDraftBookingDto.endTime,
          createDraftBookingDto.startTime,
        );

        const fieldGroup = field.fieldGroup;

        let fieldPrice = fieldGroup.basePrice * playTime;

        if (
          fieldGroup.peakStartTime &&
          fieldGroup.peakEndTime &&
          fieldGroup.priceIncrease
        ) {
          const overlapPeak = durationOverlapTime(
            fieldGroup.peakEndTime,
            fieldGroup.peakEndTime,
            createDraftBookingDto.startTime,
            createDraftBookingDto.endTime,
          );

          fieldPrice += overlapPeak * fieldGroup.priceIncrease;
        }

        const newBooking = queryRunner.manager.create(Booking, {
          ...createDraftBookingDto,
          fieldPrice,
          field,
          player,
          sport,
        });

        return await queryRunner.manager.save(newBooking);
      },
    );
  }

  private async checkOverlapBookings(
    fieldId: number,
    date: Date,
    startTime: string,
    endTime: string,
    queryRunner: QueryRunner,
  ) {
    const overlapBooking = await queryRunner.manager.findOne(Booking, {
      where: [
        {
          field: {
            id: fieldId,
          },
          date: date,
          status: Not(BookingStatusEnum.CANCELLED),
          startTime: Between(startTime, endTime),
        },
        {
          field: {
            id: fieldId,
          },
          date: date,
          status: Not(BookingStatusEnum.CANCELLED),
          endTime: Between(startTime, endTime),
        },
        {
          field: {
            id: fieldId,
          },
          date: date,
          status: Not(BookingStatusEnum.CANCELLED),
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

  public async deleteDraft(bookingId: UUID, playerId: UUID) {
    const booking = await this.getById(bookingId);

    if (booking.player.id !== playerId) {
      throw new BadRequestException(
        'You do not have permission to delete this booking',
      );
    }

    if (booking.status !== BookingStatusEnum.DRAFT) {
      throw new BadRequestException('You can only delete draft booking');
    }

    await this.bookingRepository.delete(booking);

    return {
      message: 'Delete draft booking successfully',
    };
  }

  public async getById(bookingId: UUID) {
    const booking = await this.bookingRepository.findOne({
      where: {
        id: bookingId,
      },
      relations: {
        bookingServices: true,
        player: true,
        field: {
          fieldGroup: true,
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

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

  public async updateField(
    updateFieldBookingDto: UpdateFieldBookingDto,
    bookingId: UUID,
    playerId: UUID,
  ) {
    return this.transactionManagerProvider.transaction(
      async (queryRunner: QueryRunner) => {
        const booking = await this.findOneWithTransaction(
          bookingId,
          queryRunner,
          [
            'player',
            'field',
            'field.fieldGroup.facility',
            'bookingServices',
            'sport',
          ],
        );

        // booking change only with status is draft
        if (booking.status !== BookingStatusEnum.DRAFT) {
          throw new BadRequestException('You can only update draft booking');
        }

        // check player have permission to update field
        if (booking.player.id !== playerId) {
          throw new BadRequestException(
            'You do not have permission to update this booking',
          );
        }

        if (booking.field.id === updateFieldBookingDto.fieldId) {
          return {
            message: 'Same field, no need to update',
          };
        }

        await this.checkOverlapBookings(
          updateFieldBookingDto.fieldId,
          booking.date,
          booking.startTime,
          booking.endTime,
          queryRunner,
        );

        // get new field
        const newField = await this.fieldService.getByIdWithTransaction(
          updateFieldBookingDto.fieldId,
          queryRunner,
        );

        // check new field have same facility with old field
        if (
          newField.fieldGroup.facility.id !==
          booking.field.fieldGroup.facility.id
        ) {
          throw new BadRequestException(
            'New field must have same facility with old field',
          );
        }

        // check field have spoprt
        if (
          !newField.fieldGroup.sports.find(
            (sport) => sport.id === booking.sport.id,
          )
        ) {
          throw new BadRequestException(
            'New field does not have same sport with old field',
          );
        }
        // calculate field price
        const playTime = duration(booking.startTime, booking.endTime);
        let newFieldPrice = playTime * newField.fieldGroup.basePrice;

        if (
          newField.fieldGroup.peakStartTime &&
          newField.fieldGroup.peakEndTime &&
          newField.fieldGroup.priceIncrease
        ) {
          const overlapPeak = durationOverlapTime(
            newField.fieldGroup.peakStartTime,
            newField.fieldGroup.peakEndTime,
            booking.startTime,
            booking.endTime,
          );

          newFieldPrice += overlapPeak * newField.fieldGroup.priceIncrease;
        }
        // update field
        booking.field = newField;
        booking.fieldPrice = newFieldPrice;

        return await queryRunner.manager.save(booking);
      },
    );
  }

  public async updateService(
    updateServiceBookingDto: UpdateServiceBookingDto,
    bookingId: UUID,
    playerId: UUID,
  ) {
    return await this.transactionManagerProvider.transaction(
      async (queryRunner: QueryRunner) => {
        // get booking by id
        const booking = await this.findOneWithTransaction(
          bookingId,
          queryRunner,
          [
            'player',
            'field',
            'bookingServices',
            'sport',
            'field.fieldGroup.facility',
          ],
        );

        // check permission
        if (booking.player.id !== playerId) {
          throw new NotAcceptableException(
            'You do not have permission to update this booking',
          );
        }

        if (booking.bookingServices) {
          for (const oldService of booking.bookingServices) {
            await queryRunner.manager.delete(BookingServiceEntity, oldService);
          }
        }

        delete booking.bookingServices;

        let servicePrice = 0;
        const newBookingServices: BookingServiceEntity[] = [];
        // check overlap and save new services
        for (const newService of updateServiceBookingDto.bookingServicesData) {
          const service = await this.serviceService.findOneWithTransaction(
            newService.serviceId,
            queryRunner,
            ['facility', 'sport'],
          );

          // check service have same facility with field
          if (service.facility.id !== booking.field.fieldGroup.facility.id) {
            throw new BadRequestException(
              'Service must have same facility with field',
            );
          }

          // check service have same sport with booking
          if (service.sport.id !== booking.sport.id) {
            throw new BadRequestException(
              'Service must have same sport with booking',
            );
          }

          const overlapBookingServices = await queryRunner.manager.find(
            BookingServiceEntity,
            {
              where: [
                {
                  service: {
                    id: newService.serviceId,
                  },
                  booking: {
                    date: booking.date,
                    status: Not(BookingStatusEnum.CANCELLED),
                    startTime: Between(booking.startTime, booking.endTime),
                  },
                },
                {
                  service: {
                    id: newService.serviceId,
                  },
                  booking: {
                    date: booking.date,
                    status: Not(BookingStatusEnum.CANCELLED),
                    endTime: Between(booking.startTime, booking.endTime),
                  },
                },
                {
                  service: {
                    id: newService.serviceId,
                  },
                  booking: {
                    date: booking.date,
                    status: Not(BookingStatusEnum.CANCELLED),
                    startTime: LessThanOrEqual(booking.startTime),
                    endTime: MoreThanOrEqual(booking.endTime),
                  },
                },
              ],
            },
          );

          const amountOfServiceRented = overlapBookingServices.reduce(
            (prev, curr) => prev + curr.quantity,
            0,
          );

          if (amountOfServiceRented + newService.amount > service.amount) {
            throw new BadRequestException(
              `Service ${newService.serviceId} is out of stock`,
            );
          }

          servicePrice += service.price * newService.amount;

          const newBookingService = queryRunner.manager.create(
            BookingServiceEntity,
            {
              bookingId: booking.id,
              serviceId: service.id,
              quantity: newService.amount,
            },
          );

          await queryRunner.manager.save(newBookingService);

          newBookingServices.push(newBookingService);
        }

        // update price
        booking.servicePrice = servicePrice;

        await queryRunner.manager.save(booking);

        booking.bookingServices = newBookingServices;

        return booking;
      },
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
    try {
      return await this.bookingRepository.find({
        where: {
          field: {
            id: fieldId,
          },
          date: date,
        },
        order: {
          startTime: 'ASC',
        },
      });
    } catch (error) {
      throw new BadRequestException(String(error));
    }
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
      relations: {
        bookingServices: true,
      },
      order: {
        updatedAt: 'DESC',
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
      relations: {
        bookingServices: true,
      },
      order: {
        updatedAt: 'DESC',
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
      relations: {
        bookingServices: true,
      },
      order: {
        updatedAt: 'DESC',
      },
    });
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
