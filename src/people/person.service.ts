import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDto } from 'src/auths/dtos/register.dto';
import { UUID } from 'crypto';
import { QueryRunner, Repository } from 'typeorm';
import { Person } from './person.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonRoleEnum } from './enums/person-role.enum';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class PersonService {
  constructor(
    /**
     * inject personRepository
     */
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    /**
     * inject cloudinaryService
     */
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  public async create(registerDto: RegisterDto) {
    if (registerDto.role === PersonRoleEnum.ADMIN) {
      throw new NotFoundException(
        'You do not have permission to register admin account',
      );
    }

    try {
      const person = this.personRepository.create(registerDto);

      return await this.personRepository.save(person);
    } catch (error) {
      throw new BadRequestException(String(error));
    }
  }

  public async getAll() {
    return await this.personRepository.find();
  }

  public async getOneByEmail(email: string) {
    const person = await this.personRepository.findOneBy({ email });

    if (!person) {
      throw new NotFoundException('User not found');
    }

    return person;
  }

  public async findOneById(personId: UUID, relations?: string[]) {
    const person = await this.personRepository.findOne({
      where: { id: personId },
      relations,
    });

    if (!person) {
      throw new NotFoundException('Person not found');
    }

    return person;
  }

  public async findOneByIdWithTransaction(
    personId: UUID,
    queryRunner: QueryRunner,
    relations?: string[],
  ) {
    const person = await queryRunner.manager.findOne(Person, {
      where: {
        id: personId,
      },
      relations,
    });

    if (!person) {
      throw new NotFoundException('Person not found');
    }

    return person;
  }

  public async updateAvatar(image: Express.Multer.File, personId: UUID) {
    const person = await this.findOneById(personId);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { secure_url } = await this.cloudinaryService.uploadImage(image);

    if (secure_url === null)
      throw new BadRequestException('Avatar not uploaded');

    try {
      person.avatarUrl = String(secure_url);
      await this.personRepository.save(person);
    } catch (error) {
      throw new BadRequestException(String(error));
    }

    return {
      message: 'Avatar updated successfully',
    };
  }
}
