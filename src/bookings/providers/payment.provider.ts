import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PaymentDto } from '../dtos/payment.dto';
import { UUID } from 'crypto';
import { DataSource } from 'typeorm';
import { Booking } from '../booking.entity';
import { BookingStatusEnum } from '../enums/booking-status.enum';
import { Voucher } from 'src/vouchers/voucher.entity';
import { VoucherTypeEnum } from 'src/vouchers/enums/voucher-type.enum';
import { PaymentTypeEnum } from '../enums/payment-type.enum';
import {
  dateFormat,
  HashAlgorithm,
  ProductCode,
  VNPay,
  VnpLocale,
} from 'vnpay';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class PaymentProvider {
  constructor(
    /**
     * inject data source
     */
    private readonly dataSource: DataSource,
    /**
     * inject configService
     */
    private readonly configService: ConfigService,
  ) {}

  public async payment(
    paymentDto: PaymentDto,
    bookingId: UUID,
    playerId: UUID,
    req: Request,
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
        },
      });
      // check booking exist
      if (!booking) {
        throw new NotFoundException('Booking not found');
      }

      // check player id have permission to payment
      if (booking.player.id !== playerId) {
        throw new NotAcceptableException(
          'You do not have permission to payment',
        );
      }

      if (booking.status !== BookingStatusEnum.DRAFT) {
        throw new BadRequestException('You can only payment draft booking');
      }

      if (paymentDto.voucherId) {
        const voucher = await queryRunner.manager.findOne(Voucher, {
          where: {
            id: paymentDto.voucherId,
          },
          relations: {
            facility: true,
          },
        });

        if (!voucher) {
          throw new NotFoundException('Voucher not found');
        }

        if (voucher.facility.id !== booking.field.fieldGroup.facility.id) {
          throw new BadRequestException(
            'Voucher not belong to this field group',
          );
        }

        const today = new Date();

        if (today < new Date(String(voucher.startDate))) {
          throw new BadRequestException('Voucher has not started yet');
        }

        if (today > new Date(String(voucher.endDate))) {
          throw new BadRequestException('Voucher has expired');
        }

        if (voucher.remain === 0) {
          throw new BadRequestException('Voucher is out of stock');
        }

        const totalPrice = booking.fieldPrice + booking.servicePrice;

        if (totalPrice < voucher.minPrice) {
          throw new BadRequestException(
            'Total price must be greater than min price',
          );
        }

        voucher.remain -= 1;

        await queryRunner.manager.save(voucher);

        booking.voucher = voucher;

        if (voucher.voucherType === VoucherTypeEnum.CASH) {
          booking.discountAmount = voucher.discount;
        } else {
          const discount = totalPrice * (voucher.discount / 100);

          if (discount > voucher.maxDiscount) {
            booking.discountAmount = voucher.maxDiscount;
          } else {
            booking.discountAmount = discount;
          }
        }
      }

      if (paymentDto.paymentType === PaymentTypeEnum.CASH) {
        booking.paymentType = PaymentTypeEnum.CASH;
        booking.status = BookingStatusEnum.UNPAID;

        await queryRunner.manager.save(booking);

        await queryRunner.commitTransaction();

        return booking;
      } else {
        booking.paymentType = PaymentTypeEnum.ONLINE;
        booking.status = BookingStatusEnum.UNPAID;

        await queryRunner.manager.save(booking);

        const vnpay = new VNPay({
          tmnCode: this.configService.get<string>('TMN_CODE')!,
          secureSecret: this.configService.get<string>('SECURE_SECRET')!,
          vnpayHost: 'https://sandbox.vnpayment.vn',
          testMode: true, // tùy chọn, ghi đè vnpayHost thành sandbox nếu là true
          hashAlgorithm: HashAlgorithm.SHA512, // tùy chọn
        });

        const totalPrice =
          booking.fieldPrice + booking.servicePrice - booking.discountAmount;

        const paymentUrl = vnpay.buildPaymentUrl({
          vnp_Amount: totalPrice,
          vnp_IpAddr: `${
            (req.headers['x-forwarded-for'] ||
              req.connection.remoteAddress ||
              req.socket.remoteAddress ||
              req.ip) as string
          }`,
          vnp_TxnRef: booking.id,
          vnp_OrderInfo: `Thanh toan don hang ${booking.id}`,
          vnp_OrderType: ProductCode.Other,
          vnp_ExpireDate: dateFormat(new Date(Date.now() + 15 * 60 * 1000)),
          vnp_ReturnUrl:
            this.configService.get<string>('VNPAY_RETURN_URL') ||
            'http://localhost:3000/inp-vnpay',
          vnp_Locale: VnpLocale.VN,
        });

        await queryRunner.commitTransaction();

        return {
          booking,
          paymentUrl,
        };
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(String(error));
    } finally {
      await queryRunner.release();
    }
  }
}
