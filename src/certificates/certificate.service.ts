import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Facility } from 'src/facilities/facility.entity';
import { QueryRunner, Repository } from 'typeorm';
import { Certificate } from './certificate.entity';
import { UUID } from 'crypto';
import { FacilityService } from 'src/facilities/facility.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CertificateService {
  constructor(
    /**
     * inject cloudinaryService
     */
    private readonly cloudinaryService: CloudinaryService,
    /**
     * inject facilityService
     */
    @Inject(forwardRef(() => FacilityService))
    private readonly facilityService: FacilityService,
    /**
     * inject certificateRepository
     */
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
  ) {}

  public async findOneById(facilityId: UUID, relations?: string[]) {
    const certificate = await this.certificateRepository.findOne({
      where: {
        facilityId,
      },
      relations,
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    return certificate;
  }

  public async createWithTransaction(
    certificate: Express.Multer.File,
    facility: Facility,
    queryRunner: QueryRunner,
  ) {
    // check certificate memimetype
    if (!certificate.mimetype.includes('image')) {
      throw new BadRequestException('Certificate must be image');
    }

    // upload certificate
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { secure_url } =
      await this.cloudinaryService.uploadImage(certificate);

    // create new certificate
    const newCertificate = queryRunner.manager.create(Certificate, {
      facility,
      temporary: String(secure_url),
    });

    // save certificate
    return queryRunner.manager.save(newCertificate);
  }

  public async update(
    facilityId: UUID,
    updateCertificate: Express.Multer.File,
    ownerId: UUID,
  ) {
    // check owner have permission to update image into this facility
    const facility = await this.facilityService.findOneById(facilityId, [
      'owner',
    ]);

    if (facility.owner.id !== ownerId) {
      throw new NotAcceptableException('You do not have permission to update');
    }

    // upload certificate
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { secure_url } =
      await this.cloudinaryService.uploadImage(updateCertificate);

    const certificate = await this.findOneById(facilityId);

    certificate.temporary = String(secure_url);

    await this.certificateRepository.save(certificate);

    // create notification for admin

    return {
      message: 'Certificate updated successfully',
    };
  }

  public async approve(facilityId: UUID) {
    const certificate = await this.findOneById(facilityId);
  }
}
