import { UUID } from 'crypto';
import { Entity, ManyToOne } from 'typeorm';
import { EventTypeEnum } from '../enums/event-type.enum';
import { Facility } from 'src/facilities/facility.entity';
import { Sport } from 'src/sports/sport.entity';

@Entity()
export class Event {
  id: UUID;

  name: string;

  description: string;

  eventType: EventTypeEnum;

  @ManyToOne(() => Facility)
  facility: Facility;

  image?: string[];

  bannerImage: string;

  createdAt: Date;

  updatedAt: Date;

  @ManyToOne(() => Sport)
  sport: Sport;

  numberOfParticipant: number;

  
}
