import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotAcceptableException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
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
import { DeleteImageDto } from './dtos/delete-image.dto';
import { UpdateFacilityDto } from './dtos/update-facility.dto';

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
    return this.facilityService.create(createFacilityDto, images, ownerId);
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
    return this.facilityService.getByOwner(activePeopleData.sub);
  }

  @ApiOperation({
    summary: 'get facility by id (role: none)',
  })
  @Get('/:facilityId')
  @AuthRoles(AuthRoleEnum.NONE)
  public getById(@Param('facilityId', ParseUUIDPipe) facilityId: UUID) {
    return this.facilityService.getById(facilityId);
  }

  @ApiOperation({
    summary: 'update images (role: owner)',
  })
  @Put(':facilityId/update-images')
  @UseInterceptors(FilesInterceptor('images', 6))
  @AuthRoles(AuthRoleEnum.OWNER)
  public updateImages(
    @Param('facilityId', ParseUUIDPipe) facilityId: UUID,
    @ActivePeople('sub') ownerId: UUID,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.facilityService.updateImages(images, facilityId, ownerId);
  }

  @ApiOperation({
    summary: 'delete image (role: owner)',
  })
  @Delete(':facilityId/delete-image')
  @AuthRoles(AuthRoleEnum.OWNER)
  public deleteImage(
    @Body() deleteImageDto: DeleteImageDto,
    @Param('facilityId', ParseUUIDPipe) facilityId: UUID,
    @ActivePeople('sub') ownerId: UUID,
  ) {
    return this.facilityService.deleteImage(
      deleteImageDto,
      facilityId,
      ownerId,
    );
  }

  @ApiOperation({
    summary: 'update facility (role: owner)',
  })
  @Patch(':facilityId')
  @AuthRoles(AuthRoleEnum.OWNER)
  public update(
    @Body() updateFacilityDto: UpdateFacilityDto,
    @Param('facilityId', ParseUUIDPipe) facilityId: UUID,
    @ActivePeople('sub') ownerId: UUID,
  ) {
    return this.facilityService.update(updateFacilityDto, facilityId, ownerId);
  }
}
