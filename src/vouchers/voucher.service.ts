import { Injectable } from '@nestjs/common';
import { CreateProvider } from './providers/create.provider';
import { CreateVoucherDto } from './dtos/create-voucher.dto';
import { UUID } from 'crypto';
import { DeleteProvider } from './providers/delete.provider';
import { GetByFacilityProvider } from './providers/get-by-facility.provider';
import { UpdateProvider } from './providers/update.provider';
import { UpdateVoucherDto } from './dtos/update-voucher.dto';
import { GetByIdProvider } from './providers/get-by-id.provider';

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
    /**
     * inject update provider
     */
    private readonly updateProvider: UpdateProvider,
    /**
     * inject get by id provider
     */
    private readonly getByIdProvider: GetByIdProvider,
  ) {}

  public async create(
    createVoucherDto: CreateVoucherDto,
    facilityId: UUID,
    ownerId: UUID,
  ) {
    return await this.createProvider.create(
      createVoucherDto,
      facilityId,
      ownerId,
    );
  }

  public async delete(voucherId: number, ownerId: UUID) {
    return await this.deleteProvider.delete(voucherId, ownerId);
  }

  public async getByFacility(facilityId: UUID) {
    return await this.getByFacilityProvider.getByFacility(facilityId);
  }

  public async update(updateVoucherDto: UpdateVoucherDto, ownerId: UUID) {
    return await this.updateProvider.update(updateVoucherDto, ownerId);
  }

  public async getById(voucherId: number) {
    return await this.getByIdProvider.getById(voucherId);
  }
}
