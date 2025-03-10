import { Injectable } from '@nestjs/common';
import { CreateUserProvider } from './providers/create-user.provider';
import { RegisterDto } from 'src/auths/dtos/register.dto';
import { GetAllPeopleProvider } from './providers/get-all-people.provider';
import { GetPeopleByEmailProvider } from './providers/get-people-by-email.provider';
import { GetMyInfoProvider } from './providers/get-my-info.provider';
import { ActivePeopleData } from 'src/auths/interfaces/active-people-data.interface';
import { GetPeopleByIdProvider } from './providers/get-people-by-id.provider';
import { UUID } from 'crypto';
import { UpdateAvatarProvider } from './providers/update-avatar.provider';

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
    /**
     * inject update avatar provider
     */
    private readonly updateAvatarProvider: UpdateAvatarProvider,
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

  public async updateAvatar(image: Express.Multer.File, peopleId: UUID) {
    return await this.updateAvatarProvider.updateAvatar(image, peopleId);
  }
}
