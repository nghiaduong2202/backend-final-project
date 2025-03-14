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
    if (createVoucherDto.startTime > createVoucherDto.endTime) {
      throw new BadRequestException('Start time must be before end time');
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
