import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GenderEnum } from './enums/gender.enum';
import { UUID } from 'crypto';
import { Facility } from 'src/facilities/facility.entity';
import { Exclude } from 'class-transformer';
import { PeopleRoleEnum } from './enums/people-role.enum';
import { Booking } from 'src/bookings/booking.entity';

@Entity()
export class People {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  @Exclude()
  password: string;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  phoneNumber?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  avatarUrl?: string;

  @Column({
    type: 'enum',
    enum: GenderEnum,
    nullable: true,
  })
  gender?: GenderEnum;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  dob?: Date;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  bankAccount?: string;

  @Column({
    type: 'enum',
    enum: PeopleRoleEnum,
    nullable: false,
    default: PeopleRoleEnum.PLAYER,
  })
  role: PeopleRoleEnum;

  @Exclude()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => Facility, (facility) => facility.owner)
  facilities: Facility[];

  @OneToMany(() => Booking, (booking) => booking.player)
  bookings: Booking[];
}
