import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { CreateVoucherDto } from '../dtos/create-voucher.dto';
import { UUID } from 'crypto';
import { Repository } from 'typeorm';
import { Voucher } from '../voucher.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FacilityService } from 'src/facilities/facility.service';
import { VoucherTypeEnum } from '../enums/voucher-type.enum';

@Injectable()
export class CreateProvider {
  constructor(
    /**
     * inject voucher repository
     */
    @InjectRepository(Voucher)
    private readonly voucherRepository: Repository<Voucher>,
    /**
     * inject facility service
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

    // lấy thông tin facility
    const facility = await this.facilityService.getById(facilityId);
    // kiểm tra facility có phải của owner hay không
    if (facility.owner.id !== ownerId) {
      throw new NotAcceptableException(
        'You do not have permission to create new voucher in this facility',
      );
    }
    // lưu vào cơ sở dữ liệu
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
      message: 'create voucher successfull',
    };
  }
}
