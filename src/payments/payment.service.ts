import { Injectable } from '@nestjs/common';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './payment.entity';
import { QueryRunner } from 'typeorm';
import { Booking } from 'src/bookings/booking.entity';

@Injectable()
export class PaymentService {
  public async createWithTransaction(
    fieldPrice: number,
    booking: Booking,
    queryRunner: QueryRunner,
  ) {
    const payment = queryRunner.manager.create(Payment, {
      fieldPrice,
      booking,
    });

    return await queryRunner.manager.save(payment);
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
