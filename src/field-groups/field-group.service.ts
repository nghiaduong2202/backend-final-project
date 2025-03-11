import { Injectable } from '@nestjs/common';
import { GetByIdProvider } from './providers/get-by-id.provider';
import { UUID } from 'crypto';
import { CreateManyProvider } from './providers/create-many.provider';
import { CreateFieldGroupsDto } from './dtos/create-field-groups.dto';

@Injectable()
export class FieldGroupService {
  constructor(
    /**
     * inject get field group by id provider
     */
    private readonly getByIdProvider: GetByIdProvider,
    /**
     * inject create field group provider
     */
    private readonly createManyProvider: CreateManyProvider,
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
}
