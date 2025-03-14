import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateVoucherDto } from '../dtos/update-voucher.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Voucher } from '../voucher.entity';
import { UUID } from 'crypto';

@Injectable()
export class UpdateProvider {
  constructor(
    /**
     * inject voucher repository
     */
    @InjectRepository(Voucher)
    private readonly voucherRepository: Repository<Voucher>,
  ) {}

  public async update(updateVoucherDto: UpdateVoucherDto, ownerId: UUID) {
    const voucher = await this.voucherRepository.findOne({
      where: { id: updateVoucherDto.id },
      relations: {
        facility: {
          owner: true,
        },
      },
    });

    if (!voucher) {
      throw new NotFoundException('Voucher not found');
    }

    if (voucher.facility.owner.id !== ownerId) {
      throw new NotAcceptableException(
        'You do not have permission to update this voucher',
      );
    }

    try {
      if (updateVoucherDto.name) voucher.name = updateVoucherDto.name;
      if (updateVoucherDto.code) voucher.code = updateVoucherDto.code;
      if (updateVoucherDto.voucherType)
        voucher.voucherType = updateVoucherDto.voucherType;
      if (updateVoucherDto.startTime)
        voucher.startTime = updateVoucherDto.startTime;
      if (updateVoucherDto.endTime) voucher.endTime = updateVoucherDto.endTime;
      if (updateVoucherDto.amount) {
        const remain =
          voucher.remain + updateVoucherDto.amount - voucher.amount;
        voucher.amount = updateVoucherDto.amount;
        voucher.remain = remain;
      }
      if (updateVoucherDto.value) voucher.value = updateVoucherDto.value;
      if (updateVoucherDto.minPrice)
        voucher.minPrice = updateVoucherDto.minPrice;
      if (updateVoucherDto.maxDiscount)
        voucher.maxDiscount = updateVoucherDto.maxDiscount;

      await this.voucherRepository.save(voucher);
    } catch (error) {
      throw new BadRequestException(error);
    }

    return {
      message: 'Update voucher successfully',
    };
  }
}
