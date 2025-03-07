import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { People } from '../people.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from 'src/auths/dtos/register.dto';
import { PeopleRoleEnum } from '../enums/people-role.enum';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
  ) {}

  public async createUser(registerDto: RegisterDto) {
    const role = registerDto.role;

    if (role === PeopleRoleEnum.ADMIN) {
      throw new NotFoundException(
        'You do not have permission to register admin account',
      );
    }

    try {
      const newPeople = this.peopleRepository.create(registerDto);

      return await this.peopleRepository.save(newPeople);
    } catch (error) {
      throw new BadRequestException({
        description: String(error),
      });
    }
  }
}
