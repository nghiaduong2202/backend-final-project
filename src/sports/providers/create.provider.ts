import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Sport } from '../sport.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSportDto } from '../dtos/create-sport.dto';

@Injectable()
export class CreateProvider {
  constructor(
    /**
     * inject sport repository
     */
    @InjectRepository(Sport)
    private readonly sportRepository: Repository<Sport>,
  ) {}

  public async create(createSportDto: CreateSportDto) {
    let newSport: Sport;
    try {
      newSport = this.sportRepository.create(createSportDto);
    } catch (error) {
      throw new BadRequestException('Error create new sport', {
        description: String(error),
      });
    }

    return await this.sportRepository.save(newSport);
  }
}
