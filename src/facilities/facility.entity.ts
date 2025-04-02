import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FacilityStatusEnum } from './enums/facility-status.enum';
import { UUID } from 'crypto';
import { Service } from 'src/services/service.entity';
import { Voucher } from 'src/vouchers/voucher.entity';
import { FieldGroup } from 'src/field-groups/field-group.entity';
import { Person } from 'src/people/person.entity';
import { Certificate } from 'src/certificates/certificate.entity';
import { License } from 'src/licenses/license.entity';
import { isBefore } from 'src/common/utils/is-before';
@Entity()
export class Facility {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'time',
    nullable: false,
  })
  openTime1: string;

  @Column({
    type: 'time',
    nullable: false,
  })
  closeTime1: string;

  @Column({
    type: 'time',
    nullable: true,
  })
  openTime2?: string;

  @Column({
    type: 'time',
    nullable: true,
  })
  closeTime2?: string;

  @Column({
    type: 'time',
    nullable: true,
  })
  openTime3?: string;

  @Column({
    type: 'time',
    nullable: true,
  })
  closeTime3?: string;

  @Column({
    type: 'integer',
    nullable: false,
    default: 1,
  })
  numberOfShifts: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  location: string;

  @Column({
    type: 'enum',
    enum: FacilityStatusEnum,
    nullable: false,
    default: FacilityStatusEnum.PENDING,
  })
  status: FacilityStatusEnum;

  @Column({
    type: 'real',
    nullable: false,
    default: 0.0,
  })
  avgRating: number;

  @Column({
    type: 'integer',
    nullable: false,
    default: 0,
  })
  numberOfRating: number;

  @Column({
    type: 'varchar',
    length: 255,
    array: true,
    nullable: true,
  })
  imagesUrl?: string[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => Service, (service) => service.facility)
  services: Service[];

  @OneToMany(() => Voucher, (voucher) => voucher.facility)
  vouchers: Voucher[];

  @OneToMany(() => FieldGroup, (fieldGroup) => fieldGroup.facility)
  fieldGroups: FieldGroup[];

  @ManyToOne(() => Person, (person) => person.facilities, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn()
  owner: Person;

  @OneToOne(() => Certificate, (certificate) => certificate.facility)
  certificate: Certificate;

  @OneToMany(() => License, (license) => license.facility)
  licenses: License[];

  @BeforeInsert()
  @BeforeUpdate()
  beforeInsertAndUpdate() {
    /**
     * openTime > closeTime
     */
    isBefore(
      this.openTime1,
      this.closeTime1,
      'Open time must be before close time',
    );

    this.numberOfShifts = 1;

    if (this.openTime2 && this.closeTime2) {
      isBefore(
        this.closeTime1,
        this.openTime2,
        'Close time 1 must be before openTime 2',
      );

      isBefore(
        this.openTime2,
        this.closeTime2,
        'Open time must be before close time',
      );

      this.numberOfShifts = 2;

      if (this.openTime3 && this.closeTime3) {
        isBefore(
          this.closeTime1,
          this.openTime2,
          'Close time 2 must be before openTime 3',
        );

        isBefore(
          this.openTime3,
          this.closeTime3,
          'Open time must be before close time',
        );

        this.numberOfShifts = 3;
      }
    }
  }
}
