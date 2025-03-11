import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { Repository } from 'typeorm';
import { Voucher } from '../voucher.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DeleteProvider {
  constructor(
    /**
     * inject voucher repository
     */
    @InjectRepository(Voucher)
    private readonly voucherRepository: Repository<Voucher>,
  ) {}
  public async delete(voucherId: number, ownerId: UUID) {
    // get voucher by id
    const voucher = await this.voucherRepository.findOne({
      where: {
        id: voucherId,
      },
      relations: {
        facility: {
          owner: true,
        },
      },
    });

    // check voucher exist
    if (!voucher) {
      throw new NotFoundException('Voucher not found');
    }

    // check owner have permission to delete
    if (ownerId !== voucher.facility.owner.id) {
      throw new NotAcceptableException(
        'You do not have permission to delete this voucher',
      );
    }

    // delete voucher
    await this.voucherRepository.delete(voucherId);

    return { message: 'Delete voucher successfully' };
  }
}
