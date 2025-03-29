import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseDatePipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AuthRoles } from 'src/auths/decorators/auth-role.decorator';
import { AuthRoleEnum } from 'src/auths/enums/auth-role.enum';
import { CreateDraftBookingDto } from './dtos/create-draft-booking.dto';
import { BookingService } from './booking.service';
import { ActivePerson } from 'src/auths/decorators/active-person.decorator';
import { UUID } from 'crypto';
import { UpdateFieldBookingDto } from './dtos/update-field-booking.dto';
import { UpdateServiceBookingDto } from './dtos/upadte-services-booking.dto';
import { PaymentDto } from './dtos/payment.dto';
import { Request } from 'express';

@Controller('booking')
export class BookingController {
  constructor(
    /**
     * inject booking service
     */
    private readonly bookingService: BookingService,
  ) {}

  @ApiOperation({
    summary: 'Create booking (role: player)',
  })
  @Post()
  @AuthRoles(AuthRoleEnum.PLAYER)
  public createDraft(
    @Body() createDraftBookingDto: CreateDraftBookingDto,
    @ActivePerson('sub') playerId: UUID,
  ) {
    return this.bookingService.createDraft(createDraftBookingDto, playerId);
  }

  @ApiOperation({
    summary: 'Delete draft booking (role: player)',
  })
  @Delete(':bookingId')
  @AuthRoles(AuthRoleEnum.PLAYER)
  public deleteDraft(
    @Param('bookingId', ParseUUIDPipe) bookingId: UUID,
    @ActivePerson('sub') playerId: UUID,
  ) {
    return this.bookingService.deleteDraft(bookingId, playerId);
  }

  @ApiOperation({
    summary: 'Update field (role: player)',
  })
  @Put(':bookingId/field')
  @AuthRoles(AuthRoleEnum.PLAYER)
  public updateField(
    @Param('bookingId', ParseUUIDPipe) bookingId: UUID,
    @Body() updateFieldBookingDto: UpdateFieldBookingDto,
    @ActivePerson('sub') playerId: UUID,
  ) {
    return this.bookingService.updateField(
      updateFieldBookingDto,
      bookingId,
      playerId,
    );
  }

  @Put(':bookingId/service')
  @AuthRoles(AuthRoleEnum.PLAYER)
  public updateService(
    @Param('bookingId', ParseUUIDPipe) bookingId: UUID,
    @Body() updateServiceBookingDto: UpdateServiceBookingDto,
    @ActivePerson('sub') playerId: UUID,
  ) {
    return this.bookingService.updateService(
      updateServiceBookingDto,
      bookingId,
      playerId,
    );
  }

  @ApiOperation({
    summary: 'Payment (role: player)',
  })
  @Put(':bookingId/payment')
  @AuthRoles(AuthRoleEnum.PLAYER)
  public payment(
    @Param('bookingId', ParseUUIDPipe) bookingId: UUID,
    @Body() paymentDto: PaymentDto,
    @ActivePerson('sub') playerId: UUID,
    @Req() req: Request,
  ) {
    return this.bookingService.payment(paymentDto, bookingId, playerId, req);
  }

  @Get('/vnpay-ipn')
  @AuthRoles(AuthRoleEnum.NONE)
  public inpVnpay(@Req() req: Request) {
    return this.bookingService.vnpayIpn(req);
  }

  @Get('field/:fieldId')
  @AuthRoles(AuthRoleEnum.NONE)
  public getByField(
    @Param('fieldId/') fieldId: number,
    @Query('date', new ParseDatePipe()) date: Date,
  ) {
    return this.bookingService.getByField(fieldId, date);
  }

  @ApiOperation({
    summary: 'Get booking by player (role: player)',
  })
  @Get('player/:playerId/')
  @AuthRoles(AuthRoleEnum.NONE)
  public getByPlayer(@Param('playerId', ParseUUIDPipe) playerId: UUID) {
    return this.bookingService.getByPlayer(playerId);
  }

  @ApiOperation({
    summary: 'Get booking by owner (role: owner)',
  })
  @Get('owner/:ownerId/')
  @AuthRoles(AuthRoleEnum.NONE)
  public getByOwner(@Param('ownerId', ParseUUIDPipe) ownerId: UUID) {
    return this.bookingService.getByOwner(ownerId);
  }

  @ApiOperation({
    summary: 'Get booking by facility (role: owner)',
  })
  @Get('facility/:facilityId')
  @AuthRoles(AuthRoleEnum.NONE)
  public getByFacility(@Param('facilityId', ParseUUIDPipe) facilityId: UUID) {
    return this.bookingService.getByFacility(facilityId);
  }
}
