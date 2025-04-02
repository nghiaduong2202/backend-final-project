import { UUID } from 'crypto';
import { Facility } from 'src/facilities/facility.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Certificate {
  @PrimaryColumn()
  facilityId: UUID;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  verified?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  temporary?: string;

  @OneToOne(() => Facility, (facility) => facility.certificate, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  facility: Facility;
}
