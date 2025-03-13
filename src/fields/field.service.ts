import { Injectable } from '@nestjs/common';
import { CreateManyProvider } from './providers/create-many.provider';
import { CreateFieldsDto } from './dtos/create-fields.dto';
import { UUID } from 'crypto';
import { GetByFieldGroupProvider } from './providers/get-by-field-group.provider';
import { UpdateProvider } from './providers/update.provider';
import { UpdateFieldDto } from './dtos/update-field.dto';
import { UpdateStatusProvider } from './providers/update-status.provider';
import { FieldStatusEnum } from './enums/field-status.entity';
import { DeleteProvider } from './providers/delete.provider';

@Injectable()
export class FieldService {
  constructor(
    /**
     * inject create fields provider
     */
    private readonly createManyProvider: CreateManyProvider,
    /**
     * inject get by field group provider
     */
    private readonly getByFieldGroupProvider: GetByFieldGroupProvider,
    /**
     * inject update provider
     */
    private readonly updateProvider: UpdateProvider,
    /**
     * inject update status provider
     */
    private readonly updateStatusProvider: UpdateStatusProvider,
    /**
     * inject delete provider
     */
    private readonly deleteProvider: DeleteProvider,
  ) {}

  public async createMany(
    createFieldsDto: CreateFieldsDto,
    fieldGroupId: UUID,
    ownerId: UUID,
  ) {
    return await this.createManyProvider.createMany(
      createFieldsDto,
      fieldGroupId,
      ownerId,
    );
  }

  public async getByFieldGroup(fieldGroupId: UUID) {
    return await this.getByFieldGroupProvider.getByFieldGroup(fieldGroupId);
  }

  public async update(
    updateFieldDto: UpdateFieldDto,
    fieldId: number,
    ownerId: UUID,
  ) {
    return this.updateProvider.update(updateFieldDto, fieldId, ownerId);
  }

  public async updateStatus(fieldId: number, fieldStatus: FieldStatusEnum) {
    return await this.updateStatusProvider.updateStatus(fieldId, fieldStatus);
  }

  public async delete(fieldId: number, ownerId: UUID) {
    return await this.deleteProvider.delete(fieldId, ownerId);
  }
}
