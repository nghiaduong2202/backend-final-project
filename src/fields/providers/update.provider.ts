import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { Repository } from 'typeorm';
import { Field } from '../field.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateFieldDto } from '../dtos/update-field.dto';
import { FieldStatusEnum } from '../enums/field-status.entity';

@Injectable()
export class UpdateProvider {
  constructor(
    /**
     * inject field repository
     */
    @InjectRepository(Field)
    private readonly fieldRepository: Repository<Field>,
  ) {}

  public async update(
    updateFieldDto: UpdateFieldDto,
    fieldId: number,
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
    console.log('🚀 ~ UpdateProvider ~ update ~ field:', field);

    if (!field) {
      throw new NotFoundException('Field not found');
    }

    if (field.fieldGroup.facility.owner.id !== ownerId) {
      throw new NotAcceptableException('You do not have permission to update');
    }

    try {
      if (updateFieldDto.name) field.name = updateFieldDto.name;
      field.status = FieldStatusEnum.PENDING;

      await this.fieldRepository.save(field);
    } catch (error) {
      throw new BadRequestException(error);
    }

    return {
      message: 'update field successful',
    };
  }
}
