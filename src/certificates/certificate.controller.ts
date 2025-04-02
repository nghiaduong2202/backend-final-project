import {
  Controller,
  Patch,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UUID } from 'crypto';
import { ActivePerson } from 'src/auths/decorators/active-person.decorator';

@Controller('certificate')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @ApiOperation({ summary: 'update certificate' })
  @Patch(':facilityId')
  @UseInterceptors(FileInterceptor('certificate'))
  update(
    @Param('facilityId') facilityId: UUID,
    @UploadedFile() updateCertificate: Express.Multer.File,
    @ActivePerson('sub') ownerId: UUID,
  ) {
    return this.certificateService.update(
      facilityId,
      updateCertificate,
      ownerId,
    );
  }
}
