import { Body, Controller, Get, Post } from '@nestjs/common';
import { RoleService } from './providers/role.service';
import { CreateRoleDto } from './dtos/create-role.dto';
import { ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/auths/decorators/role.decorator';
import { RoleEnum } from 'src/auths/enums/role.enum';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({
    summary: 'create a new role',
  })
  @Post()
  @Roles(RoleEnum.ADMIN)
  public createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.addRole(createRoleDto);
  }

  @ApiOperation({
    summary: 'get all role',
  })
  @Roles(RoleEnum.NONE)
  @Get()
  public getAllRole() {
    return this.roleService.getAllRole();
  }
}
