import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSportDto } from './dtos/create-sport.dto';
import { Sport } from './sport.entity';
import { QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SportService {
  constructor(
    /**
     * inject sportRepository
     */
    @InjectRepository(Sport)
    private readonly sportRepository: Repository<Sport>,
  ) {}

  public async create(createSportDto: CreateSportDto) {
    try {
      const sport = this.sportRepository.create(createSportDto);

      return await this.sportRepository.save(sport);
    } catch (error) {
      throw new BadRequestException(String(error));
    }
  }

  public async getAll() {
    return await this.sportRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  public async getById(sportId: number) {
    const sport = await this.sportRepository.findOne({
      where: {
        id: sportId,
      },
    });

    if (!sport) {
      throw new NotFoundException('Sport not found');
    }

    return sport;
  }

  public async getByIdWithTransaction(
    sportId: number,
    queryRunner: QueryRunner,
  ) {
    const sport = await queryRunner.manager.findOneBy(Sport, {
      id: sportId,
    });

    if (!sport) {
      throw new NotFoundException('Sport not found');
    }

    return sport;
  }

  public async getByManyId(ids: number[]) {
    const sports: Sport[] = [];

    for (const id of ids) {
      const sport = await this.getById(id);

      sports.push(sport);
    }

    return sports;
  }
}
