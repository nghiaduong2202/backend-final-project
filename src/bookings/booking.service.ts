import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { UUID } from 'crypto';
import { CreateProvider } from './providers/create.provider';

@Injectable()
export class BookingService {
  constructor(
    /**
     * inject create provider
     */
    private readonly createProvider: CreateProvider,
  ) {}

  public async create(createBookingDto: CreateBookingDto, playerId: UUID) {
    return await this.createProvider.create(createBookingDto, playerId);
  }
}
