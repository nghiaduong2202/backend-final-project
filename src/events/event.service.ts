import { Injectable } from '@nestjs/common';
import { IEventService } from './ievent.service';
import { UUID } from 'crypto';
import { CreateEventDto } from './dtos/create-event.dto';
import { DataSource } from 'typeorm';
import { FacilityService } from 'src/facilities/facility.service';
import { SportService } from 'src/sports/sport.service';
import { Event } from './entities/event.entity';
import { Prize } from './entities/prize.entity';

@Injectable()
export class EventService implements IEventService {
  constructor(
    /**
     * inject DataSource
     */
    private readonly dataSource: DataSource,
    /**
     * inject FacilityService
     */
    private readonly facilityService: FacilityService,
    /**
     * inject SportService
     */
    private readonly sportService: SportService,
  ) {}

  public async create(
    createEventDto: CreateEventDto,
    ownerId: UUID,
  ): Promise<{ message: string }> {
    const facility = await this.facilityService.findOneByIdAndOwnerId(
      createEventDto.facilityId,
      ownerId,
    );

    const sport = await this.sportService.findOneById(createEventDto.sportId);

    await this.dataSource.transaction(async (manager) => {
      const event = manager.create(Event, {
        ...createEventDto,
        facility,
        sport,
      });

      await manager.save(event);

      if (createEventDto.prizeDtos) {
        for (const prize of createEventDto.prizeDtos) {
          const newPrize = manager.create(Prize, {
            ...prize,
            event,
          });

          await manager.save(newPrize);
        }
      }
    });

    return { message: 'Create event successful' };
  }
}
