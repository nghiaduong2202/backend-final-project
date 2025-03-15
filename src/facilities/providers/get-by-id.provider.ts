import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Facility } from '../facility.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';

@Injectable()
export class GetByIdProvider {
  constructor(
    /**
     * inject facility repository
     */
    @InjectRepository(Facility)
    private readonly facilityRepository: Repository<Facility>,
  ) {}

  public async getById(facilityId: UUID) {
    const facility = await this.facilityRepository.findOne({
      where: {
        id: facilityId,
      },
      relations: {
        owner: true,
        fieldGroups: {
          sports: true,
        },
      },
    });

    if (!facility) {
      throw new NotFoundException('Facility not found');
    }

    const { fieldGroups, ...rest } = facility;

    return {
      ...rest,
      sports: fieldGroups
        .map((fieldGroup) => fieldGroup.sports)
        .flat()
        .filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.id === item.id),
        ),
    };
  }
}
