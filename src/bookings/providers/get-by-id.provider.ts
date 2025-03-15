import { BadRequestException, Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { Booking } from '../booking.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GetByIdProvider {
  constructor(
    /**
     * inject booking repository
     */
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  public async getById(bookingId: UUID) {
    try {
      return await this.bookingRepository.findOne({
        where: {
          id: bookingId,
        },
        relations: {
          bookingServices: true,
          player: true,
          field: {
            fieldGroup: true,
          },
          sport: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(String(error));
    }
  }
}
