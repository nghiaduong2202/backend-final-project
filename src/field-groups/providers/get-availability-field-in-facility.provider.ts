import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { GetAvailabilityFieldInFacilityDto } from '../dtos/get-availability-field-in-facility.dto';
import { UUID } from 'crypto';
import { Repository } from 'typeorm';
import { FieldGroup } from '../field-group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FacilityService } from 'src/facilities/facility.service';
import { isBetweenTime } from 'src/utils/is-between-time';
import { isBefore } from 'src/utils/is-before';
import { durationOverlapTime } from 'src/utils/duration-overlap-time';
import { BookingStatusEnum } from 'src/bookings/enums/booking-status.enum';

@Injectable()
export class GetAvailabilityFieldInFacilityProvider {
  constructor(
    /**
     * inject field group repository
     */
    @InjectRepository(FieldGroup)
    private readonly fieldGroupRepository: Repository<FieldGroup>,
    /**
     * inject facility service
     */
    @Inject(forwardRef(() => FacilityService))
    private readonly facilityService: FacilityService,
  ) {}

  public async getAvailabilityFieldInFacility(
    getAvailabilityFieldInFacilityDto: GetAvailabilityFieldInFacilityDto,
    facilityId: UUID,
  ) {
    try {
      if (
        !isBefore(
          getAvailabilityFieldInFacilityDto.startTime,
          getAvailabilityFieldInFacilityDto.endTime,
        )
      ) {
        throw new BadRequestException('Start time must be before end time');
      }

      const facility = await this.facilityService.getById(facilityId);

      if (
        !isBetweenTime(
          getAvailabilityFieldInFacilityDto.startTime,
          getAvailabilityFieldInFacilityDto.endTime,
          facility.openTime,
          facility.closeTime,
        )
      ) {
        throw new BadRequestException('Facility is not open or closed');
      }

      const fieldGroups = await this.fieldGroupRepository.find({
        where: {
          facility: {
            id: facilityId,
          },
        },
        relations: {
          fields: {
            bookings: true,
          },
          sports: true,
        },
      });

      const startTime = getAvailabilityFieldInFacilityDto.startTime;
      const endTime = getAvailabilityFieldInFacilityDto.endTime;
      const date = getAvailabilityFieldInFacilityDto.date
        .toISOString()
        .split('T')[0];

      const availableFieldGroups = fieldGroups
        .filter((fieldGroup) => {
          for (const sport of fieldGroup.sports) {
            if (sport.id === getAvailabilityFieldInFacilityDto.sportId) {
              return true;
            }
          }

          return false;
        })
        .map((fieldGroup) => ({
          ...fieldGroup,
          fields: fieldGroup.fields
            .filter((field) => {
              for (const booking of field.bookings) {
                if (
                  booking.status !== BookingStatusEnum.CANCELLED &&
                  String(booking.date) === String(date) &&
                  durationOverlapTime(
                    startTime,
                    endTime,
                    booking.startTime,
                    booking.endTime,
                  ) !== 0
                ) {
                  return false;
                }
              }

              return true;
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .map(({ bookings, ...field }) => field),
        }));

      return availableFieldGroups.filter(
        (fieldGroup) => fieldGroup.fields.length,
      );
    } catch (error) {
      throw new BadRequestException(String(error));
    }
  }
}
