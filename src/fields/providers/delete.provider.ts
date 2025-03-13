import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { Repository } from 'typeorm';
import { Field } from '../field.entity';

@Injectable()
export class DeleteProvider {
  constructor(
    /**
     * inject field repository
     */
    @InjectRepository(Field)
    private readonly fieldRepository: Repository<Field>,
  ) {}

  public async delete(fieldId: number, ownerId: UUID) {
    // get field
    const field = await this.fieldRepository.findOne({
      where: {
        id: fieldId,
      },
      select: {
        fieldGroup: {
          id: true,
          facility: {
            id: true,
            owner: {
              id: true,
            },
          },
        },
      },
      relations: {
        fieldGroup: {
          facility: {
            owner: true,
          },
        },
      },
    });

    // check field exist
    if (!field) {
      throw new NotFoundException('Field not found');
    }

    // check owner have permission to delete
    if (field.fieldGroup?.facility?.owner?.id !== ownerId) {
      throw new NotAcceptableException(
        'You do not have permission to delete this field',
      );
    }
    // delete field
    try {
      await this.fieldRepository.delete(field);
    } catch (error) {
      throw new BadRequestException(error);
    }
    return {
      message: 'Delete field successfully',
    };
  }
}
