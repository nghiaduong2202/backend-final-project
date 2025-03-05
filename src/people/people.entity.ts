import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GenderEnum } from './enums/gender.enum';
import { Role } from 'src/roles/role.entity';
import { UUID } from 'crypto';
import { Facility } from 'src/facilities/facility.entity';
import { Exclude } from 'class-transformer';

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
    type: 'enum',
    enum: GenderEnum,
    nullable: true,
  })
  gender?: GenderEnum;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  dob: Date;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  bankAccount: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Role)
  role: Role;

  @OneToMany(() => Facility, (facility) => facility.owner)
  facilities: Facility[];
}
