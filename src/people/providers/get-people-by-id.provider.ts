import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { People } from '../people.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';

@Injectable()
export class GetPeopleByIdProvider {
  constructor(
    /**
     * inject people repository
     */
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
  ) {}

  public async getPeopleById(peopleId: UUID) {
    const people = await this.peopleRepository.findOneBy({ id: peopleId });

    if (!people) {
      throw new NotFoundException('People not found');
    }

    return people;
  }
}
