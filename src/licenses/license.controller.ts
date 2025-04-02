import {
  Controller,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { LicenseService } from './license.service';
import { UUID } from 'crypto';
import { ApiOperation } from '@nestjs/swagger';
import { AuthRoles } from 'src/auths/decorators/auth-role.decorator';
import { AuthRoleEnum } from 'src/auths/enums/auth-role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { ActivePerson } from 'src/auths/decorators/active-person.decorator';

@Controller('license')
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}

  @ApiOperation({
    summary: 'update license',
  })
  @Patch(':facilityId')
  @AuthRoles(AuthRoleEnum.OWNER)
  @UseInterceptors(FileInterceptor('license'))
  update(
    @Param('facilityId', ParseUUIDPipe) id: UUID,
    @Query('sport', ParseIntPipe) sportId: number,
    @UploadedFile() license: Express.Multer.File,
    @ActivePerson('sub') ownerId: UUID,
  ) {
    return this.licenseService.update(id, sportId, license, ownerId);
  }

  @Delete(':facilityId')
  remove(
    @Param('facilityId', ParseUUIDPipe) facilityId: UUID,
    @Query('sport', ParseIntPipe) sportId: number,
    @ActivePerson('sub') ownerId: UUID,
  ) {
    return this.licenseService.remove(facilityId, sportId, ownerId);
  }
}
