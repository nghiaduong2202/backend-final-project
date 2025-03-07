import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FieldStatusEnum } from './enums/field-status.entity';
import { FieldGroup } from 'src/field-groups/field-group.entity';

@Entity()
export class Field {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'enum',
    enum: FieldStatusEnum,
    default: FieldStatusEnum.PENDING,
  })
  status: FieldStatusEnum;

  @ManyToOne(() => FieldGroup, (fieldGroup) => fieldGroup.fields, {
    cascade: true,
  })
  @JoinColumn()
  fieldGroup: FieldGroup;
}
