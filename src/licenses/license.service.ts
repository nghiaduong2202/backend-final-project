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
import { SportService } from 'src/sports/sport.service';
import { QueryRunner, Repository } from 'typeorm';
import { License } from './license.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';

@Injectable()
export class LicenseService {
  constructor(
    /**
     * inject sportService
     */
    @Inject(forwardRef(() => SportService))
    private readonly sportService: SportService,
    /**
     * inject cloudinaryService
     */
    private readonly cloudinaryService: CloudinaryService,
    /**
     * inject licenseRepository
     */
    @InjectRepository(License)
    private readonly licenseRepository: Repository<License>,
  ) {}

  public async findOneById(
    facilityId: UUID,
    sportId: number,
    relations?: string[],
  ) {
    const license = await this.licenseRepository.findOne({
      where: {
        sportId,
        facilityId,
      },
      relations,
    });

    if (!license) {
      throw new NotFoundException('License not found');
    }

    return license;
  }

  public async findOneWithTransaction(
    facilityId: UUID,
    sportId: number,
    queryRunner: QueryRunner,
    relations?: string[],
  ) {
    const license = await queryRunner.manager.findOne(License, {
      where: {
        sportId,
        facilityId,
      },
      relations,
    });

    if (!license) {
      throw new NotFoundException('License not found');
    }

    return license;
  }

  public async createWithTransaction(
    license: Express.Multer.File,
    facility: Facility,
    sportId: number,
    queryRunner: QueryRunner,
  ) {
    // check mimetype
    if (!license.mimetype.includes('image')) {
      throw new BadRequestException('License must be image');
    }

    // upload license
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { secure_url } = await this.cloudinaryService.uploadImage(license);

    const sport = await this.sportService.findOneByIdWithTransaction(
      sportId,
      queryRunner,
    );

    const newLicense = queryRunner.manager.create(License, {
      facility,
      sport,
      temporary: String(secure_url),
    });

    // save license
    return queryRunner.manager.save(newLicense);
  }

  public async update(
    facilityId: UUID,
    sportId: number,
    license: Express.Multer.File,
    ownerId: UUID,
  ) {
    const licenseObject = await this.findOneById(facilityId, sportId, [
      'facility.owner',
    ]);

    // check permistion
    if (licenseObject.facility.owner.id !== ownerId) {
      throw new NotAcceptableException(
        'You do not have permission to update license',
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { secure_url } = await this.cloudinaryService.uploadImage(license);

    licenseObject.temporary = String(secure_url);

    await this.licenseRepository.save(licenseObject);

    return {
      message: 'Update license successful',
    };
  }

  public async remove(facilityId: UUID, sportId: number, ownerId: UUID) {
    const license = await this.findOneById(facilityId, sportId, [
      'facility.owner',
    ]);

    // check permission
    if (license.facility.owner.id !== ownerId) {
      throw new NotAcceptableException(
        'You do not have permission to delete license',
      );
    }

    await this.licenseRepository.remove(license);

    return {
      message: 'Delete license successfull',
    };
  }

  public async approve(facilityId: UUID, sportId: number) {
    const license = await this.findOneById(facilityId, sportId);

    license.verified = license.temporary;

    delete license.temporary;

    return await this.licenseRepository.save(license);
  }
}
