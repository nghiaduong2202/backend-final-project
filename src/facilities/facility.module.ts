import { forwardRef, Module } from '@nestjs/common';
import { FacilityController } from './facility.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facility } from './facility.entity';
import { PersonModule } from 'src/people/person.module';
import { FacilityService } from './facility.service';
import { FieldGroupModule } from 'src/field-groups/field-gourp.module';
import { SportModule } from 'src/sports/sport.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CertificateModule } from 'src/certificates/certificate.module';
import { LicenseModule } from 'src/licenses/license.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Facility]),
    PersonModule,
    forwardRef(() => FieldGroupModule),
    SportModule,
    CloudinaryModule,
    forwardRef(() => CertificateModule),
    LicenseModule,
  ],
  controllers: [FacilityController],
  providers: [FacilityService],
  exports: [FacilityService],
})
export class FacilityModule {}
