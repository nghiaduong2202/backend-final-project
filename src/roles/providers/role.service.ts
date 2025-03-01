import { Injectable } from '@nestjs/common';
import { CreateRoleProvider } from './create-role.provider';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { GetAllRoleProvider } from './get-all-role.provider';
import { GetRoleByIdProvider } from './get-role-by-id.provider';

@Injectable()
export class RoleService {
  constructor(
    /**
     * Inject AddRoleProvider
     */
    private readonly createRoleProvider: CreateRoleProvider,
    /**
     * Inject GetAllRoleProvider
     */
    private readonly getAllRoleProvider: GetAllRoleProvider,
    /**
     * Inject GetRoleById
     */
    private readonly getRoleByIdProvider: GetRoleByIdProvider,
  ) {}

  public async addRole(createRoleDto: CreateRoleDto) {
    return await this.createRoleProvider.createRole(createRoleDto);
  }

  public async getAllRole() {
    return await this.getAllRoleProvider.getAllRole();
  }

  public async getRoleById(id: number) {
    return await this.getRoleByIdProvider.getRoleById(id);
  }
}
