import { Injectable } from '@nestjs/common';
import { CreateUserProvider } from './create-user.provider';
import { RegisterDto } from 'src/auths/dtos/register.dto';
import { GetAllPeopleProvider } from './get-all-people.provider';
import { GetPeopleByEmailProvider } from './get-people-by-email.provider';
import { GetMyInfoProvider } from './get-my-info.provider';
import { ActivePeopleData } from 'src/auths/interfaces/active-people-data.interface';
import { GetPeopleByIdProvider } from './get-people-by-id.provider';
import { UUID } from 'crypto';

@Injectable()
export class PeopleService {
  constructor(
    /**
     * Inject createUserProvider
     */
    private readonly createUserProvider: CreateUserProvider,
    /**
     * Inject getAllPeopleProvider
     */
    private readonly getAllPeopleProvider: GetAllPeopleProvider,
    /**
     * Inject getPeopleByEmailProvider
     */
    private readonly getPeopleByEmailProvider: GetPeopleByEmailProvider,
    /**
     * Inject GetMyInfoProvider
     */
    private readonly getMyInfoProvider: GetMyInfoProvider,
    /**
     * inject get people by id provider
     */
    private readonly getPeopleByIdProvider: GetPeopleByIdProvider,
  ) {}

  public async createUser(registerDto: RegisterDto) {
    return await this.createUserProvider.createUser(registerDto);
  }

  public async getAllPeople() {
    return await this.getAllPeopleProvider.getAllPeople();
  }

  public async getPeopleByEmail(email: string) {
    return await this.getPeopleByEmailProvider.getPeopleByEmail(email);
  }

  public async getMyInfo(activePeopleData: ActivePeopleData) {
    return await this.getMyInfoProvider.getMyInfo(activePeopleData.sub);
  }

  public async getPeopleById(peopleId: UUID) {
    return await this.getPeopleByIdProvider.getPeopleById(peopleId);
  }
}
