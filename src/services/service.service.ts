import { Injectable } from '@nestjs/common';
import { CreateServicesDto } from './dtos/create-services.dto';
import { UUID } from 'crypto';
import { CreateManyProvider } from './providers/create-many.provider';
import { UpdateProvider } from './providers/update.provider';
import { UpdateServiceDto } from './dtos/update-service.dto';
import { GetByFacilityProvider } from './providers/get-by-facility.provider';
import { DeleteProvider } from './providers/delete.provider';
import { GetAvailabilityServiceInFacilityProvider } from './providers/get-availability-service-in-facility.provider';
import { GetAvailabilityServiceInFacilityDto } from './dtos/get-availability-service-in-facility.dto';

@Injectable()
export class ServiceService {
  constructor(
    /**
     * inject create many provider
     */
    private readonly createManyProvider: CreateManyProvider,
    /**
     * inject update provider
     */
    private readonly updateProvider: UpdateProvider,
    /**
     * inject get by facility provider
     */
    private readonly getByFacilityProvider: GetByFacilityProvider,
    /**
     * inject delete provider
     */
    private readonly deleteProvider: DeleteProvider,
    /**
     * get availability service in facility
     */
    private readonly getAvailabilityServiceInFacilityProvider: GetAvailabilityServiceInFacilityProvider,
  ) {}

  public async createMany(
    createServicesDto: CreateServicesDto,
    facilityId: UUID,
    ownerId: UUID,
  ) {
    return await this.createManyProvider.createMany(
      createServicesDto,
      facilityId,
      ownerId,
    );
  }

  public async update(
    updateServiceDto: UpdateServiceDto,
    serviceId: number,
    ownerId: UUID,
  ) {
    return await this.updateProvider.update(
      updateServiceDto,
      serviceId,
      ownerId,
    );
  }

  public async getByFacility(facilityId: UUID, sportId?: number) {
    return await this.getByFacilityProvider.getByFacility(facilityId, sportId);
  }

  public async delete(serviceId: number, ownerId: UUID) {
    return await this.deleteProvider.delete(serviceId, ownerId);
  }

  public async getAvailabilityServiceInFacility(
    getAvailabilityServiceInFacility: GetAvailabilityServiceInFacilityDto,
    facilityId: UUID,
  ) {
    return await this.getAvailabilityServiceInFacilityProvider.getAvailabilityServiceInFacility(
      getAvailabilityServiceInFacility,
      facilityId,
    );
  }
}
