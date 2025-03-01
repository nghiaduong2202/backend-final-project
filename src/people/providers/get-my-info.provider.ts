import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { People } from '../people.entity';
import { Repository } from 'typeorm';
import { UUID } from 'crypto';

@Injectable()
export class GetMyInfoProvider {
  constructor(
    /**
     * Inject peopleRepository
     */
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
  ) {}

  public async getMyInfo(id: UUID) {
    const myInfo = await this.peopleRepository.findOne({
      where: {
        id,
      },
      relations: {
        role: true,
      },
    });

    if (!myInfo) {
      throw new UnauthorizedException();
    }

    return myInfo;
  }
}
