import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role } from '../role.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GetAllRoleProvider {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  public async getAllRole() {
    try {
      const roles = await this.roleRepository.find();

      return roles;
    } catch {
      throw new RequestTimeoutException('Lost connect with database');
    }
  }
}
