import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { FieldService } from './field.service';
import { CreateFieldsDto } from './dtos/create-fields.dto';
import { UUID } from 'crypto';
import { ActivePeople } from 'src/auths/decorators/active-people.decorator';
import { AuthRoles } from 'src/auths/decorators/auth-role.decorator';
import { AuthRoleEnum } from 'src/auths/enums/auth-role.enum';
import { ApiOperation } from '@nestjs/swagger';

@Controller('field')
@UseInterceptors(ClassSerializerInterceptor)
export class FieldController {
  constructor(private readonly fieldService: FieldService) {}

  @ApiOperation({
    summary: 'craete fields (role: owner)',
  })
  @Post(':fieldGroupId')
  @AuthRoles(AuthRoleEnum.OWNER)
  public createFields(
    @Body() createFieldsDto: CreateFieldsDto,
    @Param('fieldGroupId', ParseUUIDPipe) fieldGroupId: UUID,
    @ActivePeople('sub') ownerId: UUID,
  ) {
    return this.fieldService.createMany(createFieldsDto, fieldGroupId, ownerId);
  }
}
