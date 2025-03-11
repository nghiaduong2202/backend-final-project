import { Injectable } from '@nestjs/common';
import { GetByIdProvider } from './providers/get-by-id.provider';
import { UUID } from 'crypto';
import { CreateProvider } from './providers/create.provider';
import { CreateFacilityDto } from './dtos/create-facility.dto';
import { GetAllProvider } from './providers/get-all.provider';
import { GetByOwnerProvider } from './providers/get-by-owner.provider';
import { UpdateImagesProvider } from './providers/update-images.provider';
import { DeleteImageProviver } from './providers/delete-image.proviver';
import { DeleteImageDto } from './dtos/delete-image.dto';
import { UpdateProvider } from './providers/update.provider';
import { UpdateFacilityDto } from './dtos/update-facility.dto';

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
    /**
     * inject update images provider
     */
    private readonly updateImagesProvider: UpdateImagesProvider,
    /**
     * inject delete image provider
     */
    private readonly deleteImageProvider: DeleteImageProviver,
    /**
     * inject update provider
     */
    private readonly updateProvider: UpdateProvider,
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

  public async updateImages(
    images: Express.Multer.File[],
    facilityId: UUID,
    ownerId: UUID,
  ) {
    return await this.updateImagesProvider.updateImages(
      images,
      facilityId,
      ownerId,
    );
  }

  public async deleteImage(
    deleteImageDto: DeleteImageDto,
    facilityId: UUID,
    ownerId: UUID,
  ) {
    return await this.deleteImageProvider.deleteImage(
      deleteImageDto,
      facilityId,
      ownerId,
    );
  }

  public async update(
    updateFacilityDto: UpdateFacilityDto,
    facilityId: UUID,
    ownerId: UUID,
  ) {
    return await this.updateProvider.update(
      updateFacilityDto,
      facilityId,
      ownerId,
    );
  }
}
