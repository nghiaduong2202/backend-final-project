import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { People } from '../people.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GetAllProvider {
  constructor(
    /**
     * Inject peopleRepository
     */
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
  ) {}

  public async getAll() {
    return await this.peopleRepository.find();
  }
}
