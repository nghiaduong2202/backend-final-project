import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { People } from '../people.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GetByEmailProvider {
  constructor(
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
  ) {}

  public async getByEmail(email: string) {
    const existingPeople = await this.peopleRepository.findOneBy({ email });

    if (!existingPeople) {
      throw new NotFoundException('User not found');
    }

    return existingPeople;
  }
}
