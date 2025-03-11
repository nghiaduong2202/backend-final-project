import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Sport } from '../sport.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GetByIdProvider {
  constructor(
    /**
     * inject sport repository
     */
    @InjectRepository(Sport)
    private readonly sportRepository: Repository<Sport>,
  ) {}

  public async getById(sportId: number) {
    const sport = await this.sportRepository.findOne({
      where: {
        id: sportId,
      },
    });

    if (!sport) {
      throw new NotFoundException(`Sport id(${sportId}) not found`);
    }

    return sport;
  }
}
