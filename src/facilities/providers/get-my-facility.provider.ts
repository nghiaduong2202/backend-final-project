import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Facility } from '../facility.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { PeopleService } from 'src/people/providers/people.service';

@Injectable()
export class GetMyFacilityProvider {
  constructor(
    /**
     * inject facility repository
     */
    @InjectRepository(Facility)
    private readonly facilityRepository: Repository<Facility>,
    /**
     * inject people service
     */
    private readonly peopleService: PeopleService,
  ) {}

  public async getMyFacility(ownerId: UUID) {
    const facilities = await this.facilityRepository.find({
      where: {
        owner: {
          id: ownerId,
        },
      },
      relations: {
        fields: true,
      },
    });

    return facilities;
  }
}
