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
@Check('"endDate" >= "startDate"')
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
    type: 'date',
    nullable: false,
  })
  startDate: Date;

  @Column({
    type: 'date',
    nullable: false,
  })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: VoucherTypeEnum,
  })
  voucherType: VoucherTypeEnum;

  @Column({
    type: 'real',
    nullable: false,
    default: 0,
  })
  discount: number;

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
