import {
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
import { Sport } from 'src/sports/sport.entity';

@Entity()
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
    type: 'timestamp',
    nullable: false,
  })
  startTime: Date;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  endTime: Date;

  @Column({
    type: 'enum',
    enum: VoucherTypeEnum,
    default: VoucherTypeEnum.CASH,
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Facility, (facility) => facility.vouchers, {
    cascade: true,
  })
  @JoinColumn()
  facility: Facility;

  @ManyToOne(() => Sport, {
    cascade: true,
  })
  sport: Sport;
}
