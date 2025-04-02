import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Repository } from 'typeorm';
import {
  HashAlgorithm,
  ReturnQueryFromVNPay,
  VerifyReturnUrl,
  VNPay,
} from 'vnpay';
import { Booking } from '../booking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';

@Injectable()
export class VnpayIpnProvider {
  constructor(
    /**
     * inject config service
     */
    private readonly configService: ConfigService,
    /**
     * inject booking repository
     */
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  public async vnpayIpn(req: Request) {
    try {
      const vnpay = new VNPay({
        tmnCode: this.configService.get<string>('TMN_CODE')!,
        secureSecret: this.configService.get<string>('SECURE_SECRET')!,
        vnpayHost: 'https://sandbox.vnpayment.vn',
        testMode: true, // tùy chọn, ghi đè vnpayHost thành sandbox nếu là true
        hashAlgorithm: HashAlgorithm.SHA512, // tùy chọn
      });

      const verify: VerifyReturnUrl = vnpay.verifyIpnCall(
        req.query as ReturnQueryFromVNPay,
      );

      if (!verify.isVerified) {
        throw new BadRequestException('Invalid request');
      }

      const booking = await this.bookingRepository.findOne({
        where: {
          id: verify.vnp_TxnRef as UUID,
        },
      });

      if (!booking) {
        throw new NotFoundException('Booking not found');
      }

      // if (!verify.isSuccess) {
      //   booking.status = BookingStatusEnum.CANCELLED;
      //   await this.bookingRepository.save(booking);
      //   throw new BadRequestException('Payment failed');
      // }

      // booking.status = BookingStatusEnum.PAID;
      // await this.bookingRepository.save(booking);
      // return {
      //   message: 'Payment success',
      // };
    } catch (error) {
      throw new BadRequestException(String(error));
    }
  }
}
