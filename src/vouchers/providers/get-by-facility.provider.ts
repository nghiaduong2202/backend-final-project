import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Voucher } from '../voucher.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';

@Injectable()
export class GetByFacilityProvider {
  constructor(
    /**
     * inject voucher repository
     */
    @InjectRepository(Voucher)
    private readonly voucherRepository: Repository<Voucher>,
  ) {}

  public async getByFacility(facilityId: UUID) {
    const vouchers = await this.voucherRepository.find({
      where: {
        facility: {
          id: facilityId,
        },
      },
    });

    return vouchers;
  }
}
