import { UUID } from 'crypto';
import { Facility } from 'src/facilities/facility.entity';
import { Sport } from 'src/sports/sport.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class License {
  @PrimaryColumn()
  facilityId: UUID;

  @PrimaryColumn()
  sportId: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  verified: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  temporary?: string;

  @ManyToOne(() => Facility, (facility) => facility.licenses, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'facilityId',
  })
  facility: Facility;

  @ManyToOne(() => Sport, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'sportId',
  })
  sport: Sport;
}
