import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateVoucherDto } from './dtos/create-voucher.dto';
import { UUID } from 'crypto';
import { UpdateVoucherDto } from './dtos/update-voucher.dto';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Voucher } from './voucher.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FacilityService } from 'src/facilities/facility.service';
import { VoucherTypeEnum } from './enums/voucher-type.enum';

@Injectable()
export class VoucherService {
  constructor(
    /**
     * inject voucherRepository
     */
    @InjectRepository(Voucher)
    private readonly voucherRepository: Repository<Voucher>,
    /**
     * inject facilityService
     */
    private readonly facilityService: FacilityService,
  ) {}

  public async create(
    createVoucherDto: CreateVoucherDto,
    facilityId: UUID,
    ownerId: UUID,
  ) {
    if (
      createVoucherDto.voucherType === VoucherTypeEnum.PERCENT &&
      createVoucherDto.discount > 100
    ) {
      throw new BadRequestException('Discount must be less than 100');
    }

    if (createVoucherDto.startDate > createVoucherDto.endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    if (
      createVoucherDto.voucherType === VoucherTypeEnum.CASH &&
      createVoucherDto.discount !== createVoucherDto.maxDiscount
    ) {
      throw new BadRequestException('Max discount must be equal to discount');
    }

    // get facility
    const facility = await this.facilityService.findOne(facilityId, ['owner']);

    // check permission
    if (facility.owner.id !== ownerId) {
      throw new NotAcceptableException(
        'You do not have permission to create new voucher in this facility',
      );
    }

    try {
      const voucher = this.voucherRepository.create({
        ...createVoucherDto,
        facility,
        remain: createVoucherDto.amount,
      });

      await this.voucherRepository.save(voucher);
    } catch (error) {
      throw new BadRequestException(String(error));
    }

    return {
      message: 'Create voucher successfully',
    };
  }

  public async findOne(voucherId: number, relations?: string[]) {
    const voucher = await this.voucherRepository.findOne({
      where: {
        id: voucherId,
      },
      relations: relations,
    });

    if (!voucher) {
      throw new NotFoundException('Voucher not found');
    }

    return voucher;
  }

  public async delete(voucherId: number, ownerId: UUID) {
    // find one voucher by id
    const voucher = await this.findOne(voucherId, ['facility.owner']);

    // check permission
    if (voucher.facility.owner.id !== ownerId) {
      throw new NotAcceptableException(
        'You do not have permission to delete this voucher',
      );
    }

    //delte voucher
    try {
      await this.voucherRepository.delete(voucher);
    } catch (error) {
      throw new BadRequestException(String(error));
    }

    return {
      message: 'Delete voucher successfully',
    };
  }

  public async getByFacility(facilityId: UUID) {
    const today = new Date();

    const vouchers = await this.voucherRepository.find({
      where: {
        facility: {
          id: facilityId,
        },
        startDate: LessThanOrEqual(today),
        endDate: MoreThanOrEqual(today),
      },
    });

    return vouchers;
  }

  public async update(updateVoucherDto: UpdateVoucherDto, ownerId: UUID) {
    // find one voucher by id
    const voucher = await this.findOne(updateVoucherDto.id, ['facility.owner']);

    // check permission
    if (voucher.facility.owner.id !== ownerId) {
      throw new NotAcceptableException(
        'You do not have permission to update this voucher',
      );
    }

    // update voucher
    try {
      if (updateVoucherDto.name) voucher.name = updateVoucherDto.name;

      if (updateVoucherDto.voucherType)
        voucher.voucherType = updateVoucherDto.voucherType;

      if (updateVoucherDto.amount) {
        const remain =
          voucher.remain + updateVoucherDto.amount - voucher.amount;
        voucher.amount = updateVoucherDto.amount;
        voucher.remain = remain;
      }

      if (updateVoucherDto.startDate)
        voucher.startDate = updateVoucherDto.startDate;
      if (updateVoucherDto.endDate) voucher.endDate = updateVoucherDto.endDate;
      if (updateVoucherDto.discount)
        voucher.discount = updateVoucherDto.discount;
      if (updateVoucherDto.minPrice)
        voucher.minPrice = updateVoucherDto.minPrice;
      if (updateVoucherDto.maxDiscount)
        voucher.maxDiscount = updateVoucherDto.maxDiscount;

      await this.voucherRepository.save(voucher);
    } catch (error) {
      throw new BadRequestException(String(error));
    }

    return {
      message: 'Update voucher successfully',
    };
  }

  public async getById(voucherId: number) {
    const voucher = await this.findOne(voucherId, ['facility']);

    return voucher;
  }

  public async getAllByFacility(facilityId: UUID) {
    const vouchers = await this.voucherRepository.find({
      where: {
        facility: {
          id: facilityId,
        },
      },
    });

    return vouchers;
  }
}
