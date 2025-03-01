import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { People } from '../people.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GetAllPeopleProvider {
  constructor(
    /**
     * Inject peopleRepository
     */
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
  ) {}

  public async getAllPeople() {
    return await this.peopleRepository.find({
      relations: {
        role: true,
      },
    });
  }
}
