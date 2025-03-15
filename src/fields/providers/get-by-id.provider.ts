import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Field } from '../field.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GetByIdProvider {
  constructor(
    /**
     * inject field repository
     */
    @InjectRepository(Field)
    private readonly fieldRepository: Repository<Field>,
  ) {}

  public async getById(fieldId: number) {
    const field = await this.fieldRepository.findOne({
      where: { id: fieldId },
      relations: {
        fieldGroup: {
          sports: true,
        },
      },
    });

    if (!field) {
      throw new NotFoundException('Field not found');
    }

    return field;
  }
}
