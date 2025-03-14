import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VoucherTypeEnum } from './enums/voucher-type.enum';
import { Facility } from 'src/facilities/facility.entity';

@Entity()
@Check('"endTime" > "startTime"')
export class Voucher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    unique: true,
  })
  code: string;

  @Column({
    type: 'date',
    nullable: false,
  })
  startTime: Date;

  @Column({
    type: 'date',
    nullable: false,
  })
  endTime: Date;

  @Column({
    type: 'enum',
    enum: VoucherTypeEnum,
  })
  vourcherType: VoucherTypeEnum;

  @Column({
    type: 'real',
    nullable: false,
    default: 0,
  })
  value: number;

  @Column({
    type: 'int',
    nullable: false,
    default: 0,
  })
  minPrice: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  maxDiscount: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  amount: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  remain: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => Facility, (facility) => facility.vouchers, {
    cascade: true,
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  facility: Facility;
}
