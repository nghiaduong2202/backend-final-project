import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AuthRoles } from 'src/auths/decorators/auth-role.decorator';
import { AuthRoleEnum } from 'src/auths/enums/auth-role.enum';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { BookingService } from './booking.service';
import { ActivePeople } from 'src/auths/decorators/active-people.decorator';
import { UUID } from 'crypto';

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
  public create(
    @Body() createBookingDto: CreateBookingDto,
    @ActivePeople('sub') playerId: UUID,
  ) {
    return this.bookingService.create(createBookingDto, playerId);
  }
}
