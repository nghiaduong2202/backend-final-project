import { UUID } from 'crypto';
import { CreateEventDto } from './dtos/create-event.dto';

export interface IEventService {
  create(
    createEventDto: CreateEventDto,
    ownerId: UUID,
  ): Promise<{ message: string }>;
}
