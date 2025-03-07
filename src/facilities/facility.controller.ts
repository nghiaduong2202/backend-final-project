import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthRoleEnum } from 'src/auths/enums/auth-role.enum';
import { CreateFacilityDto } from './dtos/create-facility.dto';
import { FacilityService } from './facility.service';
import { AuthRoles } from 'src/auths/decorators/auth-role.decorator';
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

  @Post('')
  @AuthRoles(AuthRoleEnum.OWNER)
  public create(
    @Body() createFacilityDto: CreateFacilityDto,
    @ActivePeople('sub') ownerId: UUID,
  ) {
    return this.facilityService.createFacility(createFacilityDto, ownerId);
  }
}
