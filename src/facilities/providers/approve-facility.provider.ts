import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Facility } from '../facility.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FacilityStatusEnum } from '../enums/facility-status.enum';

@Injectable()
export class ApproveFacilityProvider {
  constructor(
    /**
     * Inject facility repository
     */
    @InjectRepository(Facility)
    private readonly facilityRepository: Repository<Facility>,
  ) {}

  public async acceptFacility(facilityId: number) {
    const facility = await this.facilityRepository.findOneBy({
      id: facilityId,
    });

    if (!facility) {
      throw new BadRequestException('Facility not found');
    }

    facility.status = FacilityStatusEnum.APPROVED;

    await this.facilityRepository.save(facility);

    return 'Facility approved';
  }
}
