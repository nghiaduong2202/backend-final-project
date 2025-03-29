import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateVoucherDto } from './dtos/create-voucher.dto';
import { ActivePerson } from 'src/auths/decorators/active-person.decorator';
import { UUID } from 'crypto';
import { VoucherService } from './voucher.service';
import { AuthRoles } from 'src/auths/decorators/auth-role.decorator';
import { AuthRoleEnum } from 'src/auths/enums/auth-role.enum';
import { ApiOperation } from '@nestjs/swagger';
import { UpdateVoucherDto } from './dtos/update-voucher.dto';

@Controller('voucher')
export class VoucherController {
  constructor(
    /**
     * inject voucher service
     */
    private readonly voucherService: VoucherService,
  ) {}

  @ApiOperation({
    summary: 'create new voucher (role: owner)',
  })
  @Post(':facilityId')
  @AuthRoles(AuthRoleEnum.OWNER)
  public create(
    @Body() createVoucherDto: CreateVoucherDto,
    @Param('facilityId', ParseUUIDPipe) facilityId: UUID,
    @ActivePerson('sub') ownerId: UUID,
  ) {
    return this.voucherService.create(createVoucherDto, facilityId, ownerId);
  }

  @ApiOperation({
    summary: 'delete voucher (role: owner)',
  })
  @Delete(':id')
  @AuthRoles(AuthRoleEnum.OWNER)
  public delete(@Param('id') id: number, @ActivePerson('sub') ownerId: UUID) {
    return this.voucherService.delete(id, ownerId);
  }

  @ApiOperation({
    summary: 'get voucher by facility (role: none)',
  })
  @Get(':facilityId/booking')
  @AuthRoles(AuthRoleEnum.NONE)
  public getByfacility(@Param('facilityId', ParseUUIDPipe) facilityId: UUID) {
    return this.voucherService.getByFacility(facilityId);
  }

  @ApiOperation({
    summary: 'update voucher (role: owner)',
  })
  @Patch()
  @AuthRoles(AuthRoleEnum.OWNER)
  public update(
    @Body() updateVoucherDto: UpdateVoucherDto,
    @ActivePerson('sub') ownerId: UUID,
  ) {
    // return { message: 'xem xet lai viec update voucher' };
    return this.voucherService.update(updateVoucherDto, ownerId);
  }

  @ApiOperation({
    summary: 'get all voucher by facility (role: none)',
  })
  @Get(':facilityId/all')
  @AuthRoles(AuthRoleEnum.NONE)
  public getAllByFacility(
    @Param('facilityId', ParseUUIDPipe) facilityId: UUID,
  ) {
    return this.voucherService.getAllByFacility(facilityId);
  }
}
