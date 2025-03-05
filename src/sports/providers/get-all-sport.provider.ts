import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Sport } from '../sport.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GetAllSportProvider {
  constructor(
    /**
     * inject sport repository
     */
    @InjectRepository(Sport)
    private readonly sportRepository: Repository<Sport>,
  ) {}

  public async getAllSport() {
    try {
      return await this.sportRepository.find();
    } catch (error) {
      throw new RequestTimeoutException('Error get all sport', {
        description: String(error),
      });
    }
  }
}
