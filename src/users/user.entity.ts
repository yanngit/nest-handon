import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Property } from '../properties/property.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  /*@OneToMany((property) => Property, (property) => property.user)
  properties: Property[];*/
}
