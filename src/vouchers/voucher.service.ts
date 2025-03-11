import { Injectable } from '@nestjs/common';
import { CreateProvider } from './providers/create.provider';
import { CreateVoucherDto } from './dtos/create-voucher.dto';
import { UUID } from 'crypto';
import { DeleteProvider } from './providers/delete.provider';
import { GetByFacilityProvider } from './providers/get-by-facility.provider';

@Injectable()
export class VoucherService {
  constructor(
    /**
     * inject create provider
     */
    private readonly createProvider: CreateProvider,
    /**
     * inject delete provider
     */
    private readonly deleteProvider: DeleteProvider,
    /**
     * inject get by facility provider
     */
    private readonly getByFacilityProvider: GetByFacilityProvider,
  ) {}

  public async create(createVoucherDto: CreateVoucherDto, ownerId: UUID) {
    return await this.createProvider.create(createVoucherDto, ownerId);
  }

  public async delete(voucherId: number, ownerId: UUID) {
    return await this.deleteProvider.delete(voucherId, ownerId);
  }

  public async getByFacility(facilityId: UUID) {
    return await this.getByFacilityProvider.getByFacility(facilityId);
  }
}
