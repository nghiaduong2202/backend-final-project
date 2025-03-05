import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Facility } from '../facility.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GetFacilityById {
  constructor(
    /**
     * inject facility repository
     */
    @InjectRepository(Facility)
    private readonly facilityRepository: Repository<Facility>,
  ) {}

  public async getFacilityById(id: number) {
    const facility = await this.facilityRepository.findOne({
      where: {
        id,
      },
      relations: {
        fields: true,
      },
    });

    if (!facility) {
      throw new NotFoundException('Facility not found');
    }

    return facility;
  }
}
