import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { Repository } from 'typeorm';
import { FieldGroup } from '../field-group.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DeleteProvider {
  constructor(
    /**
     * inject field group repository
     */
    @InjectRepository(FieldGroup)
    private readonly fieldGroupRepository: Repository<FieldGroup>,
  ) {}

  public async delete(fieldGroupId: UUID, ownerId: UUID) {
    // get field group
    const fieldGroup = await this.fieldGroupRepository.findOne({
      where: {
        id: fieldGroupId,
      },
      relations: {
        facility: {
          owner: true,
        },
      },
    });

    if (!fieldGroup) {
      throw new NotFoundException('Field group not found');
    }

    // check permission

    if (fieldGroup.facility.owner.id !== ownerId) {
      throw new NotAcceptableException(
        'You do not have permission to delete this field group',
      );
    }

    // delete
    try {
      await this.fieldGroupRepository.delete(fieldGroup);
    } catch (error) {
      throw new BadRequestException(error);
    }

    return {
      message: 'Delete this field group successful',
    };
  }
}
