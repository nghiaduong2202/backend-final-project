import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Facility } from '../facility.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GetFacilityByIdProvider {
  constructor(
    /**
     * inject facility repository
     */
    @InjectRepository(Facility)
    private readonly facilityRepository: Repository<Facility>,
  ) {}

  public async getFacilityById(id: number) {
    const existingFacility = await this.facilityRepository.findOne({
      where: {
        id,
      },
      relations: {
        owner: true,
        fields: true,
      },
    });

    if (!existingFacility) {
      throw new NotFoundException('Facility not found');
    }

    return existingFacility;
  }
}
