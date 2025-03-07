import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Facility } from '../facility.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateFacilityDto } from '../dtos/update-facility.dto';
import { UUID } from 'crypto';

@Injectable()
export class UpdateFacilityProvider {
  constructor(
    /**
     * inject facility repository
     */
    @InjectRepository(Facility)
    private readonly facilityRepository: Repository<Facility>,
  ) {}

  public async updateFacility(
    updateFacilityDto: UpdateFacilityDto,
    ownerId: UUID,
  ) {
    const facility = await this.facilityRepository.findOne({
      where: {
        id: updateFacilityDto.id,
      },
      relations: {
        owner: true,
      },
    });

    if (!facility) {
      throw new NotFoundException('Facility Not Found');
    }

    if (facility.owner.id !== ownerId) {
      throw new NotAcceptableException(
        'You do not have permission to update this facility',
      );
    }

    if (updateFacilityDto.name) facility.name = updateFacilityDto.name;

    if (updateFacilityDto.description)
      facility.description = updateFacilityDto.description;

    if (updateFacilityDto.openTime)
      facility.openTime = updateFacilityDto.openTime;

    if (updateFacilityDto.closeTime)
      facility.closeTime = updateFacilityDto.closeTime;

    if (updateFacilityDto.location)
      facility.location = updateFacilityDto.location;

    await this.facilityRepository.save(facility);

    return { message: 'Update Successful' };
  }
}
