import {
  Injectable,
  NotFoundException,
  NotAcceptableException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Facility } from '../facility.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';

@Injectable()
export class DeleteFacilityProvider {
  constructor(
    /**
     * inject facility repository
     */
    @InjectRepository(Facility)
    private readonly facilityRepository: Repository<Facility>,
  ) {}

  public async deleteFacility(faciliryId: number, ownerId: UUID) {
    const facility = await this.facilityRepository.findOne({
      where: {
        id: faciliryId,
      },
      relations: {
        owner: true,
      },
    });

    if (!facility) {
      throw new NotFoundException('Facility not found');
    }

    if (facility.owner.id != ownerId) {
      throw new NotAcceptableException(
        'You do not have permisstion to delete this facility',
      );
    }

    await this.facilityRepository.delete(facility);

    return {
      message: 'delete facility successfull',
    };
  }
}
