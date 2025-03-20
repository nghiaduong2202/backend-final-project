import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProvider } from './providers/create.provider';
import { CreateSportDto } from './dtos/create-sport.dto';
import { GetAllProvider } from './providers/get-all.provider';
import { GetByIdProvider } from './providers/get-by-id.provider';
import { Sport } from './sport.entity';
import { QueryRunner } from 'typeorm';

@Injectable()
export class SportService {
  constructor(
    /**
     * inject create provider
     */
    private readonly createProvider: CreateProvider,
    /**
     * inject get all provider
     */
    private readonly getAllProvider: GetAllProvider,
    /**
     * inject get by ids provider
     */
    private readonly getByIdProvider: GetByIdProvider,
  ) {}

  public async create(createSportDto: CreateSportDto) {
    return await this.createProvider.create(createSportDto);
  }

  public async getAll() {
    return await this.getAllProvider.getAll();
  }

  public async getById(sportId: number) {
    return await this.getByIdProvider.getById(sportId);
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
      const sport = await this.getByIdProvider.getById(id);

      sports.push(sport);
    }

    return sports;
  }
}
