import { Injectable } from '@nestjs/common';
import { CreateManyProvider } from './providers/create-many.provider';
import { CreateFieldsDto } from './dtos/create-fields.dto';
import { UUID } from 'crypto';

@Injectable()
export class FieldService {
  constructor(
    /**
     * inject create fields provider
     */
    private readonly createManyProvider: CreateManyProvider,
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
}
