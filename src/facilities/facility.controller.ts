import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotAcceptableException,
  Param,
  ParseUUIDPipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AuthRoleEnum } from 'src/auths/enums/auth-role.enum';
import { CreateFacilityDto } from './dtos/create-facility.dto';
import { FacilityService } from './facility.service';
import { AuthRoles } from 'src/auths/decorators/auth-role.decorator';
import { ActivePeople } from 'src/auths/decorators/active-people.decorator';
import { UUID } from 'crypto';
import { ApiOperation } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateFacilityInterceptor } from './interceptors/create-facility.interceptor';
import { ActivePeopleData } from 'src/auths/interfaces/active-people-data.interface';

@Controller('facility')
@UseInterceptors(ClassSerializerInterceptor)
export class FacilityController {
  constructor(
    /**
     * inject facility service
     */
    private readonly facilityService: FacilityService,
  ) {}

  @ApiOperation({
    summary: 'create new facility and field groups and fields (role: owner)',
  })
  @Post('create')
  @UseInterceptors(FilesInterceptor('images', 10), CreateFacilityInterceptor)
  @AuthRoles(AuthRoleEnum.OWNER)
  public create(
    @Body() createFacilityDto: CreateFacilityDto,
    @UploadedFiles() images: Express.Multer.File[],
    @ActivePeople('sub') ownerId: UUID,
  ) {
    return this.facilityService.createFacility(
      createFacilityDto,
      images,
      ownerId,
    );
  }

  @ApiOperation({
    summary: 'get all facility in database (role: none)',
  })
  @Get('all')
  @AuthRoles(AuthRoleEnum.NONE)
  public getAll() {
    return this.facilityService.getAll();
  }

  @ApiOperation({
    summary: 'get my facilities (role: owner)',
  })
  @Get('my-facilities')
  @AuthRoles(AuthRoleEnum.OWNER)
  public getMyFacilities(@ActivePeople() activePeopleData: ActivePeopleData) {
    if (activePeopleData.role !== 'owner') {
      throw new NotAcceptableException(
        'You do not have permission to get my facilities',
      );
    }
    return this.facilityService.getMyFacilities(activePeopleData.sub);
  }

  @ApiOperation({
    summary: 'get facility by id (role: none)',
  })
  @Get('/:facilityId')
  @AuthRoles(AuthRoleEnum.NONE)
  public getFacilityById(@Param('facilityId', ParseUUIDPipe) facilityId: UUID) {
    return this.facilityService.getFacilityById(facilityId);
  }
}
