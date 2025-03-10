import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Facility } from '../facility.entity';
import { Repository } from 'typeorm';
import { UUID } from 'crypto';

@Injectable()
export class GetMyFacilitiesProvider {
  constructor(
    /**
     * inject facility repository
     */
    @InjectRepository(Facility)
    private readonly facilityRepository: Repository<Facility>,
  ) {}

  public async getMyFacilities(ownerId: UUID) {
    return await this.facilityRepository.find({
      where: {
        owner: {
          id: ownerId,
        },
      },
      relations: {
        fieldGroups: {
          facility: true,
        },
      },
    });
  }
}
