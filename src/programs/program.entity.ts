import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Exclude } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class Program {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  nbLots: number;

  @ManyToOne((user) => User, (user) => user.programs)
  @Exclude()
  user: User;
}
