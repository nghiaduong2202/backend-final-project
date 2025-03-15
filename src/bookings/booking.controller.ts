import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AuthRoles } from 'src/auths/decorators/auth-role.decorator';
import { AuthRoleEnum } from 'src/auths/enums/auth-role.enum';
import { CreateDraftBookingDto } from './dtos/create-draft-booking.dto';
import { BookingService } from './booking.service';
import { ActivePeople } from 'src/auths/decorators/active-people.decorator';
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
    @ActivePeople('sub') playerId: UUID,
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
    @ActivePeople('sub') playerId: UUID,
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
    @ActivePeople('sub') playerId: UUID,
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
    @ActivePeople('sub') playerId: UUID,
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
    @ActivePeople('sub') playerId: UUID,
    @Req() req: Request,
  ) {
    return this.bookingService.payment(paymentDto, bookingId, playerId, req);
  }
}
