import { UUID } from 'crypto';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventParticipantStatusEnum } from '../enums/event-participant-status.enum';
import { Event } from './event.entity';

@Entity()
export class EventParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @ManyToOne(() => Event, (event) => event.participants)
  @JoinColumn()
  event: Event;

  @Column({
    type: 'text',
    nullable: true,
  })
  note?: string;

  @Column({
    type: 'enum',
    enum: EventParticipantStatusEnum,
    default: EventParticipantStatusEnum.PENDING,
  })
  status: EventParticipantStatusEnum;
}
