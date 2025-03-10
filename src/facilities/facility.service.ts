import { Injectable } from '@nestjs/common';
import { GetFacilityByIdProvider } from './providers/get-facility-by-id.provider';
import { UUID } from 'crypto';
import { CreateFacilityProvider } from './providers/create-facility.provider';
import { CreateFacilityDto } from './dtos/create-facility.dto';
import { GetAllProvider } from './providers/get-all.provider';
import { GetMyFacilitiesProvider } from './providers/get-my-facilities.provider';

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
    /**
     * inject get all provider
     */
    private readonly getAllProvider: GetAllProvider,
    /**
     * inject get my facilities provider
     */
    private readonly getMyFacilitiesProvider: GetMyFacilitiesProvider,
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

  public async getAll() {
    return await this.getAllProvider.getAll();
  }

  public async getMyFacilities(ownerId: UUID) {
    return await this.getMyFacilitiesProvider.getMyFacilities(ownerId);
  }
}
