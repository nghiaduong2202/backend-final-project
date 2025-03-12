import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
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
import { UpdateFieldDto } from './dtos/update-field.dto';

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

  @ApiOperation({
    summary: 'get fields by field group (role: none)',
  })
  @Get(':fieldGroupId')
  @AuthRoles(AuthRoleEnum.NONE)
  public getByFieldGroup(
    @Param('fieldGroupId', ParseUUIDPipe) fieldGroupId: UUID,
  ) {
    return this.fieldService.getByFieldGroup(fieldGroupId);
  }

  @ApiOperation({
    summary: 'update field (role: owner)',
  })
  @Patch(':fieldId')
  @AuthRoles(AuthRoleEnum.OWNER)
  public update(
    @Param('fieldId', ParseIntPipe) fieldId: number,
    @Body() updateFieldDto: UpdateFieldDto,
    @ActivePeople('sub') ownerId: UUID,
  ) {
    return this.fieldService.update(updateFieldDto, fieldId, ownerId);
  }
}
