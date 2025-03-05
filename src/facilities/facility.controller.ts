import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CreateDraftDto } from './dtos/create-draft.dto';
import { FacilityService } from './providers/facility.service';
import { Roles } from 'src/auths/decorators/role.decorator';
import { RoleEnum } from 'src/auths/enums/role.enum';
import { ActivePeople } from 'src/auths/decorators/active-people.decorator';
import { UUID } from 'crypto';

@Controller('facility')
@UseInterceptors(ClassSerializerInterceptor)
export class FacilityController {
  constructor(
    /**
     * inject facility service
     */
    private readonly facilityService: FacilityService,
  ) {}
  @Post('create-draft')
  @Roles(RoleEnum.OWNER)
  public createDraft(
    @Body() createDraftDto: CreateDraftDto,
    @ActivePeople('sub') ownerId: UUID,
  ) {
    return this.facilityService.createDraft(createDraftDto, ownerId);
  }

  @Get('get-my-facilities')
  @Roles(RoleEnum.OWNER)
  public getMyFacility(@ActivePeople('sub') ownerId: UUID) {
    return this.facilityService.getMyFacility(ownerId);
  }

  @Get(':id')
  public getFacilityById(@Param('id', ParseIntPipe) id: number) {
    return this.facilityService.getFacilityById(id);
  }
}
