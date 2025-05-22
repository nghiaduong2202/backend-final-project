import { Body, Controller, Post } from '@nestjs/common';
import { EventService } from './event.service';
import { ApiOperation } from '@nestjs/swagger';
import { AuthRoles } from 'src/auths/decorators/auth-role.decorator';
import { AuthRoleEnum } from 'src/auths/enums/auth-role.enum';
import { CreateEventDto } from './dtos/create-event.dto';
import { ActivePerson } from 'src/auths/decorators/active-person.decorator';
import { UUID } from 'crypto';

@Controller('event')
export class EventController {
  constructor(
    /**
     * inject EventService
     */
    private readonly eventService: EventService,
  ) {}

  @ApiOperation({
    summary: 'create event (role: owner)',
  })
  @Post()
  @AuthRoles(AuthRoleEnum.OWNER)
  public create(
    @Body() createEventDto: CreateEventDto,
    @ActivePerson('sub') ownerId: UUID,
  ) {
    return this.eventService.create(createEventDto, ownerId);
  }
}
