import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { FieldService } from './field.service';
import { CreateManyFieldsDto } from './dtos/create-many-fields.dto';
import { UUID } from 'crypto';
import { ActivePerson } from 'src/auths/decorators/active-person.decorator';
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
  @Put(':fieldGroupId')
  @AuthRoles(AuthRoleEnum.OWNER)
  public createMany(
    @Body() createManyFieldsDto: CreateManyFieldsDto,
    @Param('fieldGroupId', ParseUUIDPipe) fieldGroupId: UUID,
    @ActivePerson('sub') ownerId: UUID,
  ) {
    return this.fieldService.createMany(
      createManyFieldsDto,
      fieldGroupId,
      ownerId,
    );
  }

  @ApiOperation({
    summary: 'update field (role: owner)',
  })
  @AuthRoles(AuthRoleEnum.OWNER)
  public update(
    @Body() updateFieldDto: UpdateFieldDto,
    @ActivePerson('sub') ownerId: UUID,
  ) {
    return this.fieldService.update(updateFieldDto, ownerId);
  }

  @ApiOperation({
    summary: 'delete field (role: owner)',
  })
  @Delete(':fieldId')
  @AuthRoles(AuthRoleEnum.OWNER)
  public delete(
    @Param('fieldId', ParseIntPipe) fieldId: number,
    @ActivePerson('sub') ownerId: UUID,
  ) {
    return this.fieldService.delete(fieldId, ownerId);
  }
}
