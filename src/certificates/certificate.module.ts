import { forwardRef, Module } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CertificateController } from './certificate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificate } from './certificate.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { FacilityModule } from 'src/facilities/facility.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Certificate]),
    CloudinaryModule,
    forwardRef(() => FacilityModule),
  ],
  controllers: [CertificateController],
  providers: [CertificateService],
  exports: [CertificateService],
})
export class CertificateModule {}
