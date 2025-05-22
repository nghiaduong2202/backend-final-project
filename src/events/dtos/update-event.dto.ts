import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';
import { UUID } from 'crypto';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @ApiProperty()
  eventId: UUID;
}
