import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Put,
} from '@nestjs/common';
import { FieldGroupService } from './field-group.service';
import { CreateFieldGroupsDto } from './dtos/create-field-groups.dto';
import { UUID } from 'crypto';
import { ActivePeople } from 'src/auths/decorators/active-people.decorator';
import { AuthRoles } from 'src/auths/decorators/auth-role.decorator';
import { AuthRoleEnum } from 'src/auths/enums/auth-role.enum';
import { ApiOperation } from '@nestjs/swagger';
import { UpdateFieldGroupDto } from './dtos/update-field-group.dto';
import { GetAvailabilityFieldInFacilityDto } from './dtos/get-availability-field-in-facility.dto';
import { Facility } from 'src/facilities/facility.entity';

@Controller('field-group')
export class FieldGroupController {
  constructor(private readonly fieldGroupService: FieldGroupService) {}

  @ApiOperation({
    summary: 'Create field group and fields (role: owner)',
  })
  @Put(':facilityId')
  @AuthRoles(AuthRoleEnum.OWNER)
  public create(
    @Body() createFieldGroupsDto: CreateFieldGroupsDto,
    @Param('facilityId', ParseUUIDPipe) facilityId: UUID,
    @ActivePeople('sub') ownerId: UUID,
  ) {
    return this.fieldGroupService.createMany(
      createFieldGroupsDto,
      facilityId,
      ownerId,
    );
  }

  @ApiOperation({
    summary: 'Get field group by facility (role: none)',
  })
  @Get(':facilityId')
  @AuthRoles(AuthRoleEnum.NONE)
  public getByFacility(@Param('facilityId', ParseUUIDPipe) facilityId: UUID) {
    return this.fieldGroupService.getByFacility(facilityId);
  }

  @ApiOperation({
    summary: 'Update field group (role: owner)',
  })
  @Patch(':fieldGroupId')
  @AuthRoles(AuthRoleEnum.OWNER)
  public update(
    @Param('fieldGroupId', ParseUUIDPipe) fieldGroupId: UUID,
    @Body() updateFieldGroupDto: UpdateFieldGroupDto,
    @ActivePeople('sub') ownerId: UUID,
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
    @ActivePeople('sub') ownerId: UUID,
  ) {
    return this.fieldGroupService.delete(fieldGroupId, ownerId);
  }

  @ApiOperation({
    summary: 'Get availability field in facility (role: none)',
  })
  @Get(':facilityId/availability-field')
  @AuthRoles(AuthRoleEnum.NONE)
  public getAvailabilityFieldInFacility(
    @Param('facilityId', ParseUUIDPipe) facilityId: UUID,
    @Body() getAvailabilityFieldInFacility: GetAvailabilityFieldInFacilityDto,
  ) {
    return this.fieldGroupService.getAvailabilityFieldInFacility(
      getAvailabilityFieldInFacility,
      facilityId,
    );
  }
}
