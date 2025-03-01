import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role } from '../role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleDto } from '../dtos/create-role.dto';

@Injectable()
export class CreateRoleProvider {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  public async createRole(createRoleDto: CreateRoleDto) {
    try {
      const newRole = this.roleRepository.create(createRoleDto);

      return await this.roleRepository.save(newRole);
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
