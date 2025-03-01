import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './providers/role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { CreateRoleProvider } from './providers/create-role.provider';
import { GetAllRoleProvider } from './providers/get-all-role.provider';
import { GetRoleByIdProvider } from './providers/get-role-by-id.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RoleController],
  providers: [
    RoleService,
    CreateRoleProvider,
    GetAllRoleProvider,
    GetRoleByIdProvider,
  ],
  exports: [RoleService],
})
export class RoleModule {}
