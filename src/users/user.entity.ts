import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Property } from '../properties/property.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @Column()
  username: string;

  @Column({ unique: true })
  /* TODO : See if we can index this column*/
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany((property) => Property, (property) => property.user)
  @Exclude()
  properties: Property[];
}
