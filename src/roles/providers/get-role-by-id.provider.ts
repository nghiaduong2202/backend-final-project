import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GetRoleByIdProvider {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  public async getRoleById(id: number) {
    const existingRole = await this.roleRepository.findOneBy({ id });

    if (!existingRole) {
      throw new NotFoundException('Not found any role with the id');
    }

    return existingRole;
  }
}
