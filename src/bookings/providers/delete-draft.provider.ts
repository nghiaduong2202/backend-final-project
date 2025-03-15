import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { Booking } from '../booking.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingStatusEnum } from '../enums/booking-status.enum';

@Injectable()
export class DeleteDraftProvider {
  constructor(
    /**
     * inject booking repository
     */
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  public async deleteDraft(bookingId: UUID, playerId: UUID) {
    const booking = await this.bookingRepository.findOne({
      where: {
        id: bookingId,
      },
      relations: {
        player: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

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
}
