import { Injectable } from '@nestjs/common';
import { CreateProvider } from './providers/create.provider';
import { RegisterDto } from 'src/auths/dtos/register.dto';
import { GetAllProvider } from './providers/get-all.provider';
import { GetByEmailProvider } from './providers/get-by-email.provider';
import { GetByIdProvider } from './providers/get-by-id.provider';
import { UUID } from 'crypto';
import { UpdateAvatarProvider } from './providers/update-avatar.provider';

@Injectable()
export class PeopleService {
  constructor(
    /**
     * Inject createUserProvider
     */
    private readonly createProvider: CreateProvider,
    /**
     * Inject getAllPeopleProvider
     */
    private readonly getAllProvider: GetAllProvider,
    /**
     * Inject getPeopleByEmailProvider
     */
    private readonly getByEmailProvider: GetByEmailProvider,
    /**
     * inject get people by id provider
     */
    private readonly getByIdProvider: GetByIdProvider,
    /**
     * inject update avatar provider
     */
    private readonly updateAvatarProvider: UpdateAvatarProvider,
  ) {}

  public async create(registerDto: RegisterDto) {
    return await this.createProvider.create(registerDto);
  }

  public async getAll() {
    return await this.getAllProvider.getAll();
  }

  public async getByEmail(email: string) {
    return await this.getByEmailProvider.getByEmail(email);
  }

  public async getById(peopleId: UUID) {
    return await this.getByIdProvider.getById(peopleId);
  }

  public async updateAvatar(image: Express.Multer.File, peopleId: UUID) {
    return await this.updateAvatarProvider.updateAvatar(image, peopleId);
  }
}
