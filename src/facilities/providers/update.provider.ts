import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateFacilityDto } from '../dtos/update-facility.dto';
import { UUID } from 'crypto';
import { Repository } from 'typeorm';
import { Facility } from '../facility.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FacilityStatusEnum } from '../enums/facility-status.enum';

@Injectable()
export class UpdateProvider {
  constructor(
    /**
     * inject facility repository
     */
    @InjectRepository(Facility)
    private readonly facilityRepository: Repository<Facility>,
  ) {}
  public async update(
    updateFacilityDto: UpdateFacilityDto,
    facilityId: UUID,
    ownerId: UUID,
  ) {
    const facility = await this.facilityRepository.findOne({
      where: {
        id: facilityId,
      },
      relations: {
        owner: true,
      },
    });

    if (!facility) {
      throw new NotFoundException('Facility not found');
    }

    if (facility.owner.id !== ownerId) {
      throw new NotAcceptableException(
        'You do not have permission to update this facility',
      );
    }

    try {
      if (updateFacilityDto.name) facility.name = updateFacilityDto.name;
      if (updateFacilityDto.description)
        facility.description = updateFacilityDto.description;
      if (updateFacilityDto.openTime)
        facility.openTime = updateFacilityDto.openTime;
      if (updateFacilityDto.closeTime)
        facility.closeTime = updateFacilityDto.closeTime;
      if (updateFacilityDto.location)
        facility.location = updateFacilityDto.location;

      facility.status = FacilityStatusEnum.PENDING;
      await this.facilityRepository.save(facility);
    } catch (error) {
      throw new BadRequestException(error);
    }

    return {
      message: 'Facility updated successfully',
    };
  }
}
