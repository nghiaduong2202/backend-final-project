import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Patch,
  Put,
} from '@nestjs/common';
import { FieldGroupService } from './field-group.service';
import { CreateManyFieldGroupsDto } from './dtos/create-many-field-groups.dto';
import { UUID } from 'crypto';
import { ActivePerson } from 'src/auths/decorators/active-person.decorator';
import { AuthRoles } from 'src/auths/decorators/auth-role.decorator';
import { AuthRoleEnum } from 'src/auths/enums/auth-role.enum';
import { ApiOperation } from '@nestjs/swagger';
import { UpdateFieldGroupDto } from './dtos/update-field-group.dto';

@Controller('field-group')
export class FieldGroupController {
  constructor(private readonly fieldGroupService: FieldGroupService) {}

  @ApiOperation({
    summary: 'Create field group and fields (role: owner)',
  })
  @Put(':facilityId')
  @AuthRoles(AuthRoleEnum.OWNER)
  public createMany(
    @Body() createManyFieldGroupsDto: CreateManyFieldGroupsDto,
    @Param('facilityId', ParseUUIDPipe) facilityId: UUID,
    @ActivePerson('sub') ownerId: UUID,
  ) {
    return this.fieldGroupService.createMany(
      createManyFieldGroupsDto,
      facilityId,
      ownerId,
    );
  }

  @ApiOperation({
    summary: 'Update field group (role: owner)',
  })
  @Patch(':fieldGroupId')
  @AuthRoles(AuthRoleEnum.OWNER)
  public update(
    @Param('fieldGroupId', ParseUUIDPipe) fieldGroupId: UUID,
    @Body() updateFieldGroupDto: UpdateFieldGroupDto,
    @ActivePerson('sub') ownerId: UUID,
  ) {
    return this.fieldGroupService.update(
      updateFieldGroupDto,
      fieldGroupId,
      ownerId,
    );
  }

  @ApiOperation({
    summary: 'delete field group (role: owner)',
  })
  @Delete(':fieldGroupId')
  @AuthRoles(AuthRoleEnum.OWNER)
  public delete(
    @Param('fieldGroupId', ParseUUIDPipe) fieldGroupId: UUID,
    @ActivePerson('sub') ownerId: UUID,
  ) {
    return this.fieldGroupService.delete(fieldGroupId, ownerId);
  }
}
