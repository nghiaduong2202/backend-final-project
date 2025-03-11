import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateVoucherDto } from '../dtos/create-voucher.dto';
import { UUID } from 'crypto';
import { Repository } from 'typeorm';
import { Voucher } from '../voucher.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FacilityService } from 'src/facilities/facility.service';
import { SportService } from 'src/sports/sport.service';

@Injectable()
export class CreateProvider {
  constructor(
    /**
     * inject voucher repository
     */
    @InjectRepository(Voucher)
    private readonly voucherRepository: Repository<Voucher>,
    /**
     * inject sport service
     */
    private readonly sportService: SportService,
    /**
     * inject facility service
     */
    private readonly facilityService: FacilityService,
  ) {}

  public async create(createVoucherDto: CreateVoucherDto, ownerId: UUID) {
    // lấy thông tin facility
    const facility = await this.facilityService.getById(
      createVoucherDto.facilityId,
    );
    // kiểm tra facility có phải của owner hay không
    if (facility.owner.id !== ownerId) {
      throw new BadRequestException(
        'You do not have permission to create new voucher in this facility',
      );
    }

    const sport = await this.sportService.getById(createVoucherDto.sportId);
    // lưu vào cơ sở dữ liệu
    const voucher = this.voucherRepository.create({
      ...createVoucherDto,
      facility,
      remain: createVoucherDto.amount,
      sport,
    });

    await this.voucherRepository.save(voucher);

    return {
      message: 'create voucher successfull',
    };
  }
}
