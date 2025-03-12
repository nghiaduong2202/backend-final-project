import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { FieldStatusEnum } from '../enums/field-status.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Field } from '../field.entity';
import { UUID } from 'crypto';

@Injectable()
export class UpdateStatusProvider {
  constructor(
    /**
     * inject field repository
     */
    @InjectRepository(Field)
    private readonly fieldRepository: Repository<Field>,
  ) {}

  public async updateStatus(
    fieldId: number,
    fieldStatus: FieldStatusEnum,
    ownerId: UUID,
  ) {
    const field = await this.fieldRepository.findOne({
      where: {
        id: fieldId,
      },
      relations: {
        fieldGroup: {
          facility: {
            owner: true,
          },
        },
      },
    });

    if (!field) {
      throw new NotFoundException('Field not found');
    }

    if (field.fieldGroup.facility.owner.id !== ownerId) {
      throw new NotAcceptableException(
        'You do not have permission to update field',
      );
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
