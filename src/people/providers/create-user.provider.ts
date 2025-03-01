import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { People } from '../people.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from 'src/auths/dtos/register.dto';
import { RoleService } from 'src/roles/providers/role.service';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
    /**
     * Inject RoleService
     */
    private readonly roleService: RoleService,
  ) {}

  public async createUser(registerDto: RegisterDto) {
    const role = await this.roleService.getRoleById(registerDto.roleId);

    if (role.roleName === 'admin') {
      throw new NotFoundException('Not found any role with the id');
    }

    try {
      const newPeople = this.peopleRepository.create({
        ...registerDto,
        role,
      });

      return await this.peopleRepository.save(newPeople);
    } catch (error) {
      throw new BadRequestException({
        description: String(error),
      });
    }
  }
}
