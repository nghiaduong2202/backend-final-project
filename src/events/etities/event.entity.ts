import { UUID } from 'crypto';
import { Entity } from 'typeorm';

@Entity()
export class Event {
  id: UUID;
}
