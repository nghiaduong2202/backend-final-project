import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({
    nullable: false,
    type: 'varchar',
    length: 50,
    name: 'role-name',
    unique: true,
  })
  roleName: string;
}
