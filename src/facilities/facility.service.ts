import { Injectable } from '@nestjs/common';
import { GetByIdProvider } from './providers/get-by-id.provider';
import { UUID } from 'crypto';
import { CreateProvider } from './providers/create.provider';
import { CreateFacilityDto } from './dtos/create-facility.dto';
import { GetAllProvider } from './providers/get-all.provider';
import { GetByOwnerProvider } from './providers/get-by-owner.provider';

@Injectable()
export class FacilityService {
  constructor(
    /**
     * inject get by id provider
     */
    private readonly getByIdProvider: GetByIdProvider,
    /**
     * inject create provider
     */
    private readonly createProvider: CreateProvider,
    /**
     * inject get all provider
     */
    private readonly getAllProvider: GetAllProvider,
    /**
     * inject get by owner provider
     */
    private readonly getByOwnerProvider: GetByOwnerProvider,
  ) {}

  public async getById(facilityId: UUID) {
    return await this.getByIdProvider.getById(facilityId);
  }

  public async create(
    createFacilityDto: CreateFacilityDto,
    images: Express.Multer.File[],
    ownerId: UUID,
  ) {
    return await this.createProvider.create(createFacilityDto, images, ownerId);
  }

  public async getAll() {
    return await this.getAllProvider.getAll();
  }

  public async getByOwner(ownerId: UUID) {
    return await this.getByOwnerProvider.getByOwner(ownerId);
  }
}
