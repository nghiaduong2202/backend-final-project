import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Facility } from '../facility.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDraftDto } from '../dtos/create-draft.dto';
import { UUID } from 'crypto';
import { PeopleService } from 'src/people/providers/people.service';

@Injectable()
export class CreateDraftProvider {
  constructor(
    /**
     * Inject facility repository
     */
    @InjectRepository(Facility)
    private readonly facilityRepository: Repository<Facility>,
    /**
     * inject people service
     */
    private readonly peopleService: PeopleService,
  ) {}

  public async createDraft(createDraftDto: CreateDraftDto, ownerId: UUID) {
    const owner = await this.peopleService.getPeopleById(ownerId);

    let newFacility: Facility;
    try {
      newFacility = this.facilityRepository.create({
        ...createDraftDto,
        owner,
      });
    } catch (error) {
      throw new BadRequestException('Error', {
        description: String(error),
      });
    }

    return await this.facilityRepository.save(newFacility);
  }
}
