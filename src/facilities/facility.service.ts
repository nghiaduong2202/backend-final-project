import { Injectable } from '@nestjs/common';
import { GetFacilityByIdProvider } from './providers/get-facility-by-id.provider';
import { UUID } from 'crypto';
import { CreateFacilityProvider } from './providers/create-facility.provider';
import { CreateFacilityDto } from './dtos/create-facility.dto';

@Injectable()
export class FacilityService {
  constructor(
    /**
     * inject get facility by id provider
     */
    private readonly getFacilityByIdProvider: GetFacilityByIdProvider,
    /**
     * inject create facility provider
     */
    private readonly createFacilityProvider: CreateFacilityProvider,
  ) {}

  public async getFacilityById(facilityId: UUID) {
    return await this.getFacilityByIdProvider.getFacilityById(facilityId);
  }

  public async createFacility(
    createFacilityDto: CreateFacilityDto,
    images: Express.Multer.File[],
    ownerId: UUID,
  ) {
    return await this.createFacilityProvider.createFacility(
      createFacilityDto,
      images,
      ownerId,
    );
  }
}
