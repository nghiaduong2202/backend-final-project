import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Voucher } from '../voucher.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GetByIdProvider {
  constructor(
    /**
     * inject voucher repository
     */
    @InjectRepository(Voucher)
    private readonly voucherRepository: Repository<Voucher>,
  ) {}

  public async getById(voucherId: number) {
    try {
      const voucher = await this.voucherRepository.findOne({
        where: {
          id: voucherId,
        },
        relations: {
          facility: true,
        },
      });

      if (!voucher) {
        throw new BadRequestException('Voucher not found');
      }

      return voucher;
    } catch (error) {
      throw new BadRequestException(String(error));
    }
  }
}
