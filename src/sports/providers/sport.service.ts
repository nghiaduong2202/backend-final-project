import { Injectable } from '@nestjs/common';
import { CreateSportProvider } from './create-sport.provider';
import { CreateSportDto } from '../dtos/create-sport.dto';
import { GetAllSportProvider } from './get-all-sport.provider';
import { GetSportByIdsProvider } from './get-sport-by-ids.provider';

@Injectable()
export class SportService {
  constructor(
    /**
     * inject create sport provider
     */
    private readonly createSportProvider: CreateSportProvider,
    /**
     * inject get all sport provider
     */
    private readonly getAllSportProvider: GetAllSportProvider,
    /**
     * inject get sport by ids provider
     */
    private readonly getSportByIdsProvider: GetSportByIdsProvider,
  ) {}

  public async createSport(createSportDto: CreateSportDto) {
    return await this.createSportProvider.createSport(createSportDto);
  }

  public async getAllSport() {
    return await this.getAllSportProvider.getAllSport();
  }

  public async getSportByIds(ids: number[]) {
    return await this.getSportByIdsProvider.getSportByIds(ids);
  }
}
