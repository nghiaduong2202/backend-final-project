import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateServiceBookingDto } from '../dtos/upadte-services-booking.dto';
import { UUID } from 'crypto';
import { Between, DataSource, LessThanOrEqual, Not } from 'typeorm';
import { Booking } from '../booking.entity';
import { BookingService } from '../booking-service.entity';
import { Service } from 'src/services/service.entiry';
import { BookingStatusEnum } from '../enums/booking-status.enum';

@Injectable()
export class UpdateServiceProvider {
  constructor(
    /**
     * inject data source
     */
    private readonly dataSource: DataSource,
  ) {}

  public async updateService(
    updateServiceBookingDto: UpdateServiceBookingDto,
    bookingId: UUID,
    playerId: UUID,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // get booking
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
          bookingServices: true,
          sport: true,
        },
      });
      // check booking exist
      if (!booking) {
        throw new NotFoundException('Booking not found');
      }

      // check player have permission to update
      if (booking.player.id !== playerId) {
        throw new NotAcceptableException(
          'You do not have permission to update',
        );
      }

      // remove old services
      if (booking.bookingServices) {
        for (const oldService of booking.bookingServices) {
          await queryRunner.manager.delete(BookingService, oldService);
        }
      }
      delete booking.bookingServices;

      let servicePrice = 0;
      const newBookingServices: BookingService[] = [];
      // check overlap and save new services
      for (const newService of updateServiceBookingDto.bookingServicesData) {
        // get service
        const service = await queryRunner.manager.findOne(Service, {
          where: {
            id: newService.serviceId,
          },
          relations: {
            facility: true,
            sport: true,
          },
        });
        // check service existing
        if (!service) {
          throw new NotFoundException(
            `Service ${newService.serviceId} not found`,
          );
        }

        // check service same facility with field
        if (service.facility.id !== booking.field.fieldGroup.facility.id) {
          throw new BadRequestException(
            `Service ${newService.serviceId} not same facility with field`,
          );
        }

        // check service same sport booking
        if (service.sport.id !== booking.sport.id) {
          throw new BadRequestException(
            `Service ${newService.serviceId} not same sport with booking`,
          );
        }
        // check not overlap with other service
        const orthersBookingService = await queryRunner.manager.find(
          BookingService,
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
                  endTime: LessThanOrEqual(booking.endTime),
                },
              },
            ],
          },
        );

        const amountOfServiceRented = orthersBookingService.reduce(
          (prev, curr) => prev + curr.quantity,
          0,
        );

        if (amountOfServiceRented + newService.amount > service.amount) {
          throw new BadRequestException(
            `Service ${newService.serviceId} is out of stock`,
          );
        }

        servicePrice += service.price * newService.amount;

        const newBookingService = queryRunner.manager.create(BookingService, {
          bookingId: booking.id,
          serviceId: service.id,
          quantity: newService.amount,
        });
        await queryRunner.manager.save(newBookingService);

        newBookingServices.push(newBookingService);
      }

      // update price
      booking.servicePrice = servicePrice;
      // delete booking.bookingServices;

      // commit transaction
      await queryRunner.manager.save(booking);
      await queryRunner.commitTransaction();

      booking.bookingServices = newBookingServices;
      return booking;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error);
    } finally {
      await queryRunner.release();
    }
  }
}
