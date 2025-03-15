import { BadRequestException, Injectable } from '@nestjs/common';
import { GetAvailabilityServiceInFacilityDto } from '../dtos/get-availability-service-in-facility.dto';
import { UUID } from 'crypto';
import { isBefore } from 'src/utils/isBefore';
import { FacilityService } from 'src/facilities/facility.service';
import { isBetweenTime } from 'src/utils/is-between-time';
import { Service } from '../service.entiry';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { durationOverlapTime } from 'src/utils/duration-overlap-time';

@Injectable()
export class GetAvailabilityServiceInFacilityProvider {
  constructor(
    /**
     * inject facility service
     */
    private readonly facilityService: FacilityService,
    /**
     * inject service repository
     */
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}
  public async getAvailabilityServiceInFacility(
    getAvailabilityServiceInFacility: GetAvailabilityServiceInFacilityDto,
    facilityId: UUID,
  ) {
    try {
      if (
        !isBefore(
          getAvailabilityServiceInFacility.startTime,
          getAvailabilityServiceInFacility.endTime,
        )
      ) {
        throw new BadRequestException('Start time must be before end time');
      }

      const facility = await this.facilityService.getById(facilityId);

      if (
        !isBetweenTime(
          getAvailabilityServiceInFacility.startTime,
          getAvailabilityServiceInFacility.endTime,
          facility.openTime,
          facility.closeTime,
        )
      ) {
        throw new BadRequestException('Facility is not open or closed');
      }

      const services = await this.serviceRepository.find({
        where: {
          facility: {
            id: facilityId,
          },
          sport: {
            id: getAvailabilityServiceInFacility.sportId,
          },
        },
        relations: {
          bookingServices: {
            booking: true,
          },
          sport: true,
        },
      });

      const date = getAvailabilityServiceInFacility.date
        .toISOString()
        .split('T')[0];

      const availabilityService = services
        .map((service) => ({
          ...service,
          bookingServices: service.bookingServices.filter((bookingService) => {
            if (
              String(bookingService.booking.date) === String(date) &&
              durationOverlapTime(
                getAvailabilityServiceInFacility.startTime,
                getAvailabilityServiceInFacility.endTime,
                bookingService.booking.startTime,
                bookingService.booking.endTime,
              ) !== 0
            ) {
              return true;
            }

            return false;
          }),
        }))
        .map(({ bookingServices, ...service }) => ({
          ...service,
          remain:
            service.amount -
            bookingServices.reduce((prev, curr) => prev + curr.quantity, 0),
        }));

      return availabilityService;
    } catch (error) {
      throw new BadRequestException(String(error));
    }
  }
}
