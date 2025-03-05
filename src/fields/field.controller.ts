import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { FieldService } from './providers/field.service';
import { CreateFieldsDto } from './dtos/create-fields.dto';
import { Roles } from 'src/auths/decorators/role.decorator';
import { RoleEnum } from 'src/auths/enums/role.enum';
import { ActivePeople } from 'src/auths/decorators/active-people.decorator';
import { UUID } from 'crypto';

@Controller('field')
@UseInterceptors(ClassSerializerInterceptor)
export class FieldController {
  constructor(
    /**
     * inject field service
     */
    private readonly fieldService: FieldService,
  ) {}

  @Post()
  @Roles(RoleEnum.OWNER)
  public createFields(
    @Body() createFieldsDto: CreateFieldsDto,
    @ActivePeople('sub') ownerId: UUID,
  ) {
    console.log(ownerId);
    return this.fieldService.createFields(createFieldsDto, ownerId);
  }
}
