import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDto } from 'src/auths/dtos/register.dto';
import { UUID } from 'crypto';
import { QueryRunner, Repository } from 'typeorm';
import { People } from './people.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PeopleRoleEnum } from './enums/people-role.enum';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class PeopleService {
  constructor(
    /**
     * inject peopleRepository
     */
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
    /**
     * inject cloudinaryService
     */
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  public async create(registerDto: RegisterDto) {
    if (registerDto.role === PeopleRoleEnum.ADMIN) {
      throw new NotFoundException(
        'You do not have permission to register admin account',
      );
    }

    try {
      const people = this.peopleRepository.create(registerDto);
      console.log('🚀 ~ PeopleService ~ create ~ people:', people);

      return await this.peopleRepository.save(people);
    } catch (error) {
      throw new BadRequestException(String(error));
    }
  }

  public async getAll() {
    return await this.peopleRepository.find();
  }

  public async getByEmail(email: string) {
    const people = await this.peopleRepository.findOneBy({ email });

    if (!people) {
      throw new NotFoundException('User not found');
    }

    return people;
  }

  public async getById(peopleId: UUID) {
    const people = await this.peopleRepository.findOneBy({ id: peopleId });

    if (!people) {
      throw new NotFoundException('People not found');
    }

    return people;
  }

  public async getByIdWithTransaction(
    peopleId: UUID,
    queryRunner: QueryRunner,
  ) {
    const people = await queryRunner.manager.findOneBy(People, {
      id: peopleId,
    });

    if (!people) {
      throw new NotFoundException('People not found');
    }

    return people;
  }

  public async updateAvatar(image: Express.Multer.File, peopleId: UUID) {
    const people = await this.getById(peopleId);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { secure_url } = await this.cloudinaryService.uploadImage(image);

    if (secure_url === null)
      throw new BadRequestException('Avatar not uploaded');

    try {
      people.avatarUrl = String(secure_url);
      await this.peopleRepository.save(people);
    } catch (error) {
      throw new BadRequestException(String(error));
    }

    return {
      message: 'Avatar updated successfully',
    };
  }
}
