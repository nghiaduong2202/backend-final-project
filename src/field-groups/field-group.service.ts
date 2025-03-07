import { Injectable } from '@nestjs/common';
import { GetFieldGroupByIdProvider } from './providers/get-field-group-by-id.provider';
import { UUID } from 'crypto';
import { CreateFieldGroupProvider } from './providers/create-field-group.provider';
import { CreateFieldGroupsDto } from './dtos/create-field-groups.dto';

@Injectable()
export class FieldGroupService {
  constructor(
    /**
     * inject get field group by id provider
     */
    private readonly getFieldGroupByIdProvider: GetFieldGroupByIdProvider,
    /**
     * inject create field group provider
     */
    private readonly createFieldGroupProvider: CreateFieldGroupProvider,
  ) {}

  public async getFieldGroupById(id: UUID) {
    return await this.getFieldGroupByIdProvider.getFieldGroupById(id);
  }

  public async createFieldGroup(
    createFieldGroupsDto: CreateFieldGroupsDto,
    facilityId: UUID,
    ownerId: UUID,
  ) {
    return await this.createFieldGroupProvider.createFieldGroups(
      createFieldGroupsDto,
      facilityId,
      ownerId,
    );
  }
}
