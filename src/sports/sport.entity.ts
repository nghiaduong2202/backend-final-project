import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Sport {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  name: string;
}
