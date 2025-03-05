import { Injectable } from '@nestjs/common';
import { CreateFieldsProvider } from './create-fields.provider';
import { CreateFieldsDto } from '../dtos/create-fields.dto';
import { UUID } from 'crypto';

@Injectable()
export class FieldService {
  constructor(
    /**
     * inject create fields provider
     */
    private readonly createFieldsProvider: CreateFieldsProvider,
  ) {}

  public async createFields(createFieldsDto: CreateFieldsDto, ownerId: UUID) {
    return this.createFieldsProvider.createFields(createFieldsDto, ownerId);
  }
}
