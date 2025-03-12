import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateFieldGroupDto } from '../dtos/update-field-group.dto';
import { UUID } from 'crypto';
import { isBefore } from 'src/utils/isBefore';
import { Repository } from 'typeorm';
import { FieldGroup } from '../field-group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SportService } from 'src/sports/sport.service';
import { FieldStatusEnum } from 'src/fields/enums/field-status.entity';

@Injectable()
export class UpdateProvider {
  constructor(
    /**
     * inject field group repository
     */
    @InjectRepository(FieldGroup)
    private readonly fieldGroupRepository: Repository<FieldGroup>,
    /**
     * inject sport service
     */
    private readonly sportService: SportService,
  ) {}

  public async update(
    updateFieldGroupDto: UpdateFieldGroupDto,
    fieldGroupId: UUID,
    ownerId: UUID,
  ) {
    // check peak time
    if (
      updateFieldGroupDto.peakEndTime &&
      updateFieldGroupDto.peakStartTime &&
      !isBefore(
        updateFieldGroupDto.peakStartTime,
        updateFieldGroupDto.peakEndTime,
      )
    ) {
      throw new BadRequestException(
        'Peak start time must be before peak end time',
      );
    }

    // get field group
    const fieldGroup = await this.fieldGroupRepository.findOne({
      where: {
        id: fieldGroupId,
      },
      relations: {
        facility: {
          owner: true,
        },
        fields: true,
      },
    });

    // check fiel group exist
    if (!fieldGroup) {
      throw new NotFoundException('Field group not found');
    }

    // check permission
    if (fieldGroup?.facility.owner.id !== ownerId) {
      throw new NotAcceptableException(
        'You do not have permission to update this field group',
      );
    }

    try {
      // update field group
      if (updateFieldGroupDto.name) fieldGroup.name = updateFieldGroupDto.name;
      if (updateFieldGroupDto.dimension)
        fieldGroup.dimension = updateFieldGroupDto.dimension;
      if (updateFieldGroupDto.surface)
        fieldGroup.surface = updateFieldGroupDto.surface;
      if (updateFieldGroupDto.basePrice)
        fieldGroup.basePrice = updateFieldGroupDto.basePrice;
      if (updateFieldGroupDto.peakEndTime)
        fieldGroup.peakEndTime = updateFieldGroupDto.peakEndTime;
      if (updateFieldGroupDto.peakStartTime)
        fieldGroup.peakStartTime = updateFieldGroupDto.peakStartTime;
      if (updateFieldGroupDto.priceIncrease)
        fieldGroup.priceIncrease = updateFieldGroupDto.priceIncrease;
      if (updateFieldGroupDto.sportIds) {
        const sports = await this.sportService.getByManyId(
          updateFieldGroupDto.sportIds,
        );
        fieldGroup.sports = sports;
      }
      // update status
      // save
      await this.fieldGroupRepository.save(fieldGroup);
    } catch (error) {
      throw new BadRequestException(error);
    }

    return {
      message: 'update field group successful',
    };
  }
}
