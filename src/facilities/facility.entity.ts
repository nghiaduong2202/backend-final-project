import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FacilityStatusEnum } from './enums/facility-status.enum';
import { People } from 'src/people/people.entity';
import { FieldGroup } from 'src/field-groups/field-group.entity';
import { UUID } from 'crypto';
import { Voucher } from 'src/vouchers/voucher.entity';
import { Exclude } from 'class-transformer';
import { Service } from 'src/services/service.entiry';
@Entity()
@Check('"openTime" < "closeTime"')
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
  openTime: string;

  @Column({
    type: 'time',
    nullable: false,
  })
  closeTime: string;
  /**
   * Có thể sửa lại thành kinh độ vĩ độ nhưng để hiện thực sau
   */
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
    default: 0.0,
  })
  avgRating: number;

  @Column({
    type: 'integer',
    default: 0,
  })
  quantityRating: number;

  @Column('simple-json', {
    nullable: true,
  })
  imagesUrl?: string[];

  @Exclude()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => People, (people) => people.facilities, {
    cascade: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  owner: People;

  @OneToMany(() => FieldGroup, (fieldGroup) => fieldGroup.facility)
  fieldGroups: FieldGroup[];

  @OneToMany(() => Voucher, (voucher) => voucher.facility)
  vouchers: Voucher[];

  @OneToMany(() => Service, (service) => service.facility)
  services: Service[];
}
