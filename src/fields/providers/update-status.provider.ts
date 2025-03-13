import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FieldStatusEnum } from '../enums/field-status.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Field } from '../field.entity';

@Injectable()
export class UpdateStatusProvider {
  constructor(
    /**
     * inject field repository
     */
    @InjectRepository(Field)
    private readonly fieldRepository: Repository<Field>,
  ) {}

  public async updateStatus(fieldId: number, fieldStatus: FieldStatusEnum) {
    const field = await this.fieldRepository.findOne({
      where: {
        id: fieldId,
      },
    });

    if (!field) {
      throw new NotFoundException('Field not found');
    }

    field.status = fieldStatus;

    try {
      await this.fieldRepository.save(field);
    } catch (error) {
      throw new BadRequestException(error);
    }

    return {
      message: 'update field status successful',
    };
  }
}
