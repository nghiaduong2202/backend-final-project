import { Injectable } from '@nestjs/common';
import { Service } from '../service.entiry';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UUID } from 'crypto';

@Injectable()
export class GetByFacilityProvider {
  constructor(
    /**
     * inject service repository
     */
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}
  public async getByFacility(facilityId: UUID, sportId?: number) {
    return await this.serviceRepository.find({
      where: {
        facility: {
          id: facilityId,
        },
        sport: {
          id: sportId,
        },
      },
      relations: {
        sport: true,
      },
    });
  }
}
