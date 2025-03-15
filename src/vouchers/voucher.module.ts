import { Module } from '@nestjs/common';
import { VoucherController } from './voucher.controller';
import { VoucherService } from './voucher.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voucher } from './voucher.entity';
import { CreateProvider } from './providers/create.provider';
import { FacilityModule } from 'src/facilities/facility.module';
import { SportModule } from 'src/sports/sport.module';
import { DeleteProvider } from './providers/delete.provider';
import { GetByFacilityProvider } from './providers/get-by-facility.provider';
import { UpdateProvider } from './providers/update.provider';
import { GetByIdProvider } from './providers/get-by-id.provider';
import { GetAllByFacilityProvider } from './providers/get-all-by-facility.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Voucher]), FacilityModule, SportModule],
  controllers: [VoucherController],
  providers: [
    VoucherService,
    CreateProvider,
    DeleteProvider,
    GetByFacilityProvider,
    UpdateProvider,
    GetByIdProvider,
    GetAllByFacilityProvider,
  ],
  exports: [VoucherService],
})
export class VoucherModule {}
