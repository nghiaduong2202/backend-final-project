import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Facility } from '../facility.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GetAllProvider {
  constructor(
    /**
     * inject facility repository
     */
    @InjectRepository(Facility)
    private readonly facilityRepository: Repository<Facility>,
  ) {}

  public async getAll() {
    return await this.facilityRepository.find({
      relations: {
        owner: true,
      },
    });
  }
}
