import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  nbLots: number;

  @ManyToOne((user) => User, (user) => user.properties)
  @Exclude()
  user: User;
}
