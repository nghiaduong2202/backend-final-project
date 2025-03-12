import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FieldGroup } from '../field-group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';

@Injectable()
export class GetByFacilityProvider {
  constructor(
    /**
     * inject field group repository
     */
    @InjectRepository(FieldGroup)
    private readonly fieldGroupRepository: Repository<FieldGroup>,
  ) {}

  public async getByFacility(facilityId: UUID) {
    return await this.fieldGroupRepository.find({
      where: {
        facility: {
          id: facilityId,
        },
      },
      relations: {
        sports: true,
      },
    });
  }
}
