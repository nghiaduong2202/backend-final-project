import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Booking } from '../booking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingStatusEnum } from '../enums/booking-status.enum';

@Injectable()
export class BookingScheduleProvider {
  constructor(
    /**
     * inject booking repository
     */
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  public async handleCron() {
    try {
      const fiveMinutes = new Date(Date.now() - 5 * 60 * 1000);
      const draftBookingOverTime = await this.bookingRepository.find({
        where: {
          status: BookingStatusEnum.DRAFT,
          createdAt: LessThanOrEqual(fiveMinutes),
        },
      });
      for (const booking of draftBookingOverTime) {
        // const res = await this.bookingRepository.delete(booking);
        // booking.status = BookingStatusEnum.CANCELLED;
        // await this.bookingRepository.save(booking);
        console.log(booking);
      }
    } catch (error) {
      console.log(String(error));
    }
  }
}
