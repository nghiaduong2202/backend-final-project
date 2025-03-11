import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Voucher } from '../voucher.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { FacilityService } from 'src/facilities/facility.service';

@Injectable()
export class GetByFacilityProvider {
  constructor(
    /**
     * inject voucher repository
     */
    @InjectRepository(Voucher)
    private readonly voucherRepository: Repository<Voucher>,
    /**
     * inject facility service
     */
    private readonly facilityService: FacilityService,
  ) {}

  public async getByFacility(facilityId: UUID) {
    const facility = await this.facilityService.getById(facilityId);

    const vouchers = await this.voucherRepository.find({
      where: {
        facility: facility,
      },
    });

    return vouchers;
  }
}
