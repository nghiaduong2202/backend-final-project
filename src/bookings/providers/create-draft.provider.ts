import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDraftBookingDto } from '../dtos/create-draft-booking.dto';
import { UUID } from 'crypto';
import {
  Between,
  DataSource,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { Booking } from '../booking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { isBefore } from 'src/utils/is-before';
import { People } from 'src/people/people.entity';
import { Field } from 'src/fields/field.entity';
import { Sport } from 'src/sports/sport.entity';
import { isBetweenTime } from 'src/utils/is-between-time';
import { duration } from 'src/utils/duration';
import { durationOverlapTime } from 'src/utils/duration-overlap-time';
import { BookingStatusEnum } from '../enums/booking-status.enum';

@Injectable()
export class CreateDraftProvider {
  constructor(
    /**
     * inject booking repository
     */
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    /**
     * inject data source
     */
    private readonly dataSource: DataSource,
  ) {}

  public async createDraft(
    createDraftBookingDto: CreateDraftBookingDto,
    playerId: UUID,
  ) {
    // check start time before end time
    if (
      !isBefore(createDraftBookingDto.startTime, createDraftBookingDto.endTime)
    ) {
      throw new BadRequestException('Start time must be before end time');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // get player
      const player = await queryRunner.manager.findOneBy(People, {
        id: playerId,
      });

      if (!player) {
        throw new NotFoundException('Player not found');
      }

      // get field
      const field = await queryRunner.manager.findOne(Field, {
        where: {
          id: createDraftBookingDto.fieldId,
        },
        relations: {
          fieldGroup: {
            sports: true,
            facility: true,
          },
        },
      });

      if (!field) {
        throw new NotFoundException('Field not found');
      }

      // get sport
      const sport = await queryRunner.manager.findOneBy(Sport, {
        id: createDraftBookingDto.sportId,
      });
      
      if (!sport) {
        throw new NotFoundException('Sport not found');
      }
      // check field have sport
      if (
        !field.fieldGroup.sports.find(
          (sport) => sport.id === createDraftBookingDto.sportId,
        )
      ) {
        throw new BadRequestException('Field not have this sport');
      }

      // check startTime and endTime between openTime and closeTime
      if (
        !isBetweenTime(
          createDraftBookingDto.startTime,
          createDraftBookingDto.endTime,
          field.fieldGroup.facility.openTime,
          field.fieldGroup.facility.closeTime,
        )
      ) {
        throw new BadRequestException(
          'Booking time not between open time and close time',
        );
      }

      // check overlap booking
      const bookings = await queryRunner.manager.findOne(Booking, {
        where: [
          {
            field: {
              id: createDraftBookingDto.fieldId,
            },
            date: createDraftBookingDto.date,
            status: Not(BookingStatusEnum.CANCELLED),
            startTime: Between(
              createDraftBookingDto.startTime,
              createDraftBookingDto.endTime,
            ),
          },
          {
            field: {
              id: createDraftBookingDto.fieldId,
            },
            date: createDraftBookingDto.date,
            status: Not(BookingStatusEnum.CANCELLED),
            endTime: Between(
              createDraftBookingDto.startTime,
              createDraftBookingDto.endTime,
            ),
          },
          {
            field: {
              id: createDraftBookingDto.fieldId,
            },
            date: createDraftBookingDto.date,
            status: Not(BookingStatusEnum.CANCELLED),
            startTime: LessThanOrEqual(createDraftBookingDto.startTime),
            endTime: MoreThanOrEqual(createDraftBookingDto.endTime),
          },
        ],
      });

      if (bookings) {
        throw new BadRequestException(
          'Booking time overlap with another booking',
        );
      }
      // create booking
      const playTime = duration(
        createDraftBookingDto.endTime,
        createDraftBookingDto.startTime,
      );

      const fieldGroup = field.fieldGroup;

      let fieldPrice = fieldGroup.basePrice * playTime;

      if (
        fieldGroup.peakEndTime &&
        fieldGroup.peakStartTime &&
        fieldGroup.priceIncrease
      ) {
        const overlapPeak = durationOverlapTime(
          fieldGroup.peakStartTime,
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

      // save booking
      await queryRunner.manager.save(newBooking);

      await queryRunner.commitTransaction();

      return newBooking;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(String(error));
    } finally {
      await queryRunner.release();
    }
  }
}
