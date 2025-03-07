import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { FieldGroupService } from './field-group.service';
import { CreateFieldGroupsDto } from './dtos/create-field-groups.dto';
import { UUID } from 'crypto';
import { ActivePeople } from 'src/auths/decorators/active-people.decorator';
import { AuthRoles } from 'src/auths/decorators/auth-role.decorator';
import { AuthRoleEnum } from 'src/auths/enums/auth-role.enum';

@Controller('group-field')
export class FieldGroupController {
  constructor(private readonly fieldGroupService: FieldGroupService) {}

  @Post(':facilityId')
  @AuthRoles(AuthRoleEnum.OWNER)
  public create(
    @Body() createFieldGroupsDto: CreateFieldGroupsDto,
    @Param('facilityId', ParseUUIDPipe) facilityId: UUID,
    @ActivePeople('sub') ownerId: UUID,
  ) {
    return this.fieldGroupService.createFieldGroup(
      createFieldGroupsDto,
      facilityId,
      ownerId,
    );
  }
}
