import { Injectable } from '@nestjs/common';
import { GetByIdProvider } from './providers/get-by-id.provider';
import { UUID } from 'crypto';
import { CreateManyProvider } from './providers/create-many.provider';
import { CreateFieldGroupsDto } from './dtos/create-field-groups.dto';
import { GetByFacilityProvider } from './providers/get-by-facility.provider';
import { UpdateProvider } from './providers/update.provider';
import { UpdateFieldGroupDto } from './dtos/update-field-group.dto';
import { DeleteProvider } from './providers/delete.provider';

@Injectable()
export class FieldGroupService {
  constructor(
    /**
     * inject get by id provider
     */
    private readonly getByIdProvider: GetByIdProvider,
    /**
     * inject create many provider
     */
    private readonly createManyProvider: CreateManyProvider,
    /**
     * inject get by facility provider
     */
    private readonly getByFacilityProvider: GetByFacilityProvider,
    /**
     * inject update provider
     */
    private readonly updateProvider: UpdateProvider,
    /**
     * inject delete provider
     */
    private readonly deleteProvider: DeleteProvider,
  ) {}

  public async getById(id: UUID) {
    return await this.getByIdProvider.getById(id);
  }

  public async createMany(
    createFieldGroupsDto: CreateFieldGroupsDto,
    facilityId: UUID,
    ownerId: UUID,
  ) {
    return await this.createManyProvider.createMany(
      createFieldGroupsDto,
      facilityId,
      ownerId,
    );
  }

  public async getByFacility(facilityId: UUID) {
    return await this.getByFacilityProvider.getByFacility(facilityId);
  }

  public async update(
    updateFieldGroupDto: UpdateFieldGroupDto,
    fieldGroupId: UUID,
    ownerId: UUID,
  ) {
    return await this.updateProvider.update(
      updateFieldGroupDto,
      fieldGroupId,
      ownerId,
    );
  }

  public async delete(fieldGroupId: UUID, ownerId: UUID) {
    return await this.deleteProvider.delete(fieldGroupId, ownerId);
  }
}
