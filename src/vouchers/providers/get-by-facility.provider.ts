import { Injectable } from '@nestjs/common';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
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
    const today = new Date();

    const vouchers = await this.voucherRepository.find({
      where: {
        facility: {
          id: facilityId,
        },
        startDate: LessThanOrEqual(today),
        endDate: MoreThanOrEqual(today),
      },
    });

    return vouchers;
  }
}
