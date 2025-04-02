import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
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
import { ActivePerson } from 'src/auths/decorators/active-person.decorator';
import { UUID } from 'crypto';
import { ApiOperation } from '@nestjs/swagger';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { CreateFacilityInterceptor } from './interceptors/create-facility.interceptor';
import { DeleteImagesDto } from './dtos/delete-images.dto';
import { UpdateFacilityDto } from './dtos/update-facility.dto';
import { sportLicensesDto } from './dtos/sport-licenses.dto';

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
    summary: 'get all facilities (role: none)',
  })
  @Get('all')
  @AuthRoles(AuthRoleEnum.NONE)
  public getAll() {
    return this.facilityService.getAll();
  }

  @ApiOperation({
    summary: 'get facility by id (role: none)',
  })
  @Get(':facilityId/drop-down')
  @AuthRoles(AuthRoleEnum.NONE)
  public getDropDownInfor(
    @Param('facilityId', ParseUUIDPipe) facilityId: UUID,
  ) {
    return this.facilityService.getDropDownInfor(facilityId);
  }

  @ApiOperation({
    summary: 'create new facility and field groups and fields (role: owner)',
  })
  @Post('create')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'images', maxCount: 10 },
      { name: 'licenses', maxCount: 7 },
      { name: 'certificate', maxCount: 1 },
    ]),
    CreateFacilityInterceptor,
  )
  @AuthRoles(AuthRoleEnum.OWNER)
  public create(
    @Body('facilityInfo') createFacilityDto: CreateFacilityDto,
    @UploadedFiles()
    files: {
      images: Express.Multer.File[];
      certificate: Express.Multer.File[];
      licenses?: Express.Multer.File[];
    },
    @ActivePerson('sub') ownerId: UUID,
    @Body('sportLicenses') sportLicensesDto?: sportLicensesDto,
  ) {
    return this.facilityService.create(
      createFacilityDto,
      files.images,
      ownerId,
      files.certificate[0],
      files.licenses,
      sportLicensesDto?.sportIds,
    );
  }

  @ApiOperation({
    summary: 'update images (role: owner)',
  })
  @Put(':facilityId/update-images')
  @UseInterceptors(FilesInterceptor('images', 6))
  @AuthRoles(AuthRoleEnum.OWNER)
  public updateImages(
    @Param('facilityId', ParseUUIDPipe) facilityId: UUID,
    @ActivePerson('sub') ownerId: UUID,
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
    @Body() deleteImagesDto: DeleteImagesDto,
    @Param('facilityId', ParseUUIDPipe) facilityId: UUID,
    @ActivePerson('sub') ownerId: UUID,
  ) {
    return this.facilityService.deleteImages(
      deleteImagesDto,
      facilityId,
      ownerId,
    );
  }

  @ApiOperation({
    summary: 'update facility (role: owner)',
  })
  @Patch(':facilityId')
  @AuthRoles(AuthRoleEnum.OWNER)
  public updateInfor(
    @Body() updateFacilityDto: UpdateFacilityDto,
    @Param('facilityId', ParseUUIDPipe) facilityId: UUID,
    @ActivePerson('sub') ownerId: UUID,
  ) {
    return this.facilityService.update(updateFacilityDto, facilityId, ownerId);
  }
}
