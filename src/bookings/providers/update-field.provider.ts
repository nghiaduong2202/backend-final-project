import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateFieldBookingDto } from '../dtos/update-field-booking.dto';
import { UUID } from 'crypto';
import {
  Between,
  DataSource,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
} from 'typeorm';
import { Booking } from '../booking.entity';
import { BookingStatusEnum } from '../enums/booking-status.enum';
import { Field } from 'src/fields/field.entity';
import { duration } from 'src/utils/duration';
import { durationOverlapTime } from 'src/utils/duration-overlap-time';

@Injectable()
export class UpdateFieldProvider {
  constructor(
    /**
     * inject data source
     */
    private readonly dataSource: DataSource,
  ) {}

  public async updateField(
    updateFieldBookingDto: UpdateFieldBookingDto,
    bookingId: UUID,
    playerId: UUID,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // get booking by id
      const booking = await queryRunner.manager.findOne(Booking, {
        where: {
          id: bookingId,
        },
        relations: {
          player: true,
          field: {
            fieldGroup: {
              facility: true,
            },
          },
        },
      });

      // check booking exist
      if (!booking) {
        throw new NotFoundException('Booking not found');
      }

      if (booking.status !== BookingStatusEnum.DRAFT) {
        throw new BadRequestException('You can only update draft booking');
      }

      // check player have permission
      if (booking.player.id !== playerId) {
        throw new BadRequestException(
          'You do not have permission to update this booking',
        );
      }

      // check old field and new field
      if (booking.field.id === updateFieldBookingDto.fieldId) {
        throw new BadRequestException('Old field and new field are the same');
      }

      // check new field is overlap
      const existingOverlapBooking = await queryRunner.manager.findOne(
        Booking,
        {
          where: [
            {
              field: {
                id: updateFieldBookingDto.fieldId,
              },
              date: booking.date,
              status: Not(BookingStatusEnum.CANCELLED),
              startTime: Between(booking.startTime, booking.endTime),
            },
            {
              field: {
                id: updateFieldBookingDto.fieldId,
              },
              date: booking.date,
              status: Not(BookingStatusEnum.CANCELLED),
              endTime: Between(booking.startTime, booking.endTime),
            },
            {
              field: {
                id: updateFieldBookingDto.fieldId,
              },
              date: booking.date,
              status: Not(BookingStatusEnum.CANCELLED),
              startTime: LessThanOrEqual(booking.startTime),
              endTime: MoreThanOrEqual(booking.endTime),
            },
          ],
        },
      );

      if (existingOverlapBooking) {
        throw new BadRequestException(
          'Booking time overlap with another booking',
        );
      }

      // update
      // get field
      const field = await queryRunner.manager.findOne(Field, {
        where: {
          id: updateFieldBookingDto.fieldId,
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

      // check field same facility with old field
      if (
        field.fieldGroup.facility.id !== booking.field.fieldGroup.facility.id
      ) {
        throw new BadRequestException('New Field is not in the same facility');
      }

      // check field have sport
      if (
        !field.fieldGroup.sports.find((sport) => sport.id === booking.sport.id)
      ) {
        throw new BadRequestException('New Field does not have this sport');
      }

      // caculator fieldPrice
      const playTime = duration(booking.startTime, booking.endTime);
      let newFieldPrice = playTime * field.fieldGroup.basePrice;

      if (
        field.fieldGroup.peakEndTime &&
        field.fieldGroup.peakStartTime &&
        field.fieldGroup.priceIncrease
      ) {
        const overlapPeak = durationOverlapTime(
          field.fieldGroup.peakStartTime,
          field.fieldGroup.peakEndTime,
          booking.startTime,
          booking.endTime,
        );

        newFieldPrice += overlapPeak * field.fieldGroup.priceIncrease;
      }

      booking.field = field;
      booking.fieldPrice = newFieldPrice;

      // save
      await queryRunner.manager.save(booking);

      await queryRunner.commitTransaction();

      return booking;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error);
    } finally {
      await queryRunner.release();
    }
  }
}
