import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Facility } from '../facility.entity';
import { FacilityStatusEnum } from '../enums/facility-status.enum';

@Injectable()
export class RejectFacilityProvider {
  constructor(
    /**
     * inject facility repository
     */
    @InjectRepository(Facility)
    private readonly facilityRepository: Repository<Facility>,
  ) {}

  public async rejectFacility(facilityId: number) {
    const facility = await this.facilityRepository.findOneBy({
      id: facilityId,
    });

    if (!facility) {
      throw new BadRequestException('Facility not found');
    }

    facility.status = FacilityStatusEnum.REJECTED;
    await this.facilityRepository.save(facility);

    return 'Facility rejected';
  }
}
