import { Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Sport } from '../sport.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GetSportByIdsProvider {
  constructor(
    /**
     * inject sport repository
     */
    @InjectRepository(Sport)
    private readonly sportRepository: Repository<Sport>,
  ) {}

  public async getSportByIds(ids: number[]) {
    const sports = await this.sportRepository.find({
      where: {
        id: In(ids),
      },
    });

    if (sports.length !== ids.length) {
      throw new NotFoundException('Not found sport');
    }

    return sports;
  }
}
