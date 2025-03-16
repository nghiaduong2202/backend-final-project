import { BadRequestException, Injectable } from '@nestjs/common';
import { Booking } from '../booking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GetByFieldProviders {
  constructor(
    /**
     * inject booking repository
     */
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  public async getByField(fieldId: number, date: Date) {
    try {
      const bookings = await this.bookingRepository.find({
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

      return bookings;
    } catch (error) {
      throw new BadRequestException(String(error));
    }
  }
}
