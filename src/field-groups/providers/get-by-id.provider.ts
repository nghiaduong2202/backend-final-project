import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FieldGroup } from '../field-group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';

@Injectable()
export class GetByIdProvider {
  constructor(
    /**
     * inject field group repository
     */
    @InjectRepository(FieldGroup)
    private readonly fieldGroupRepository: Repository<FieldGroup>,
  ) {}

  public async getById(id: UUID) {
    const fieldGroup = await this.fieldGroupRepository.findOne({
      where: {
        id,
      },
      relations: {
        facility: {
          owner: true,
        },
      },
    });

    if (!fieldGroup) {
      throw new NotFoundException('Field Group not found');
    }

    return fieldGroup;
  }
}
