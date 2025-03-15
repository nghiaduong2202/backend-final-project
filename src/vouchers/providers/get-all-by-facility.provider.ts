import { BadRequestException, Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { Repository } from 'typeorm';
import { Voucher } from '../voucher.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GetAllByFacilityProvider {
  constructor(
    /**
     * inject voucher repository
     */
    @InjectRepository(Voucher)
    private readonly voucherRepository: Repository<Voucher>,
  ) {}

  public async getAllByfacility(facilityId: UUID) {
    try {
      return await this.voucherRepository.find({
        where: {
          facility: {
            id: facilityId,
          },
        },
      });
    } catch (error) {
      throw new BadRequestException(String(error));
    }
  }
}
