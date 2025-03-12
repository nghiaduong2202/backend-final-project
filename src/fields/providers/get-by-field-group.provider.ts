import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Field } from '../field.entity';
import { UUID } from 'crypto';

@Injectable()
export class GetByFieldGroupProvider {
  constructor(
    /**
     * inject field repository
     */
    @InjectRepository(Field)
    private readonly fieldRepository: Repository<Field>,
  ) {}

  public async getByFieldGroup(fieldGroupId: UUID) {
    return await this.fieldRepository.find({
      where: {
        fieldGroup: {
          id: fieldGroupId,
        },
      },
    });
  }
}
