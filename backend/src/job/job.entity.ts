import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../user.entity';

@Entity('job')
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column('text')
  description: string;

  @Column('text')
  skills: string;

  @Column()
  budget: number;

  @Column()
  paymentMethod: string;

  @Column()
  projectDuration: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  user_id: number; // Foreign key

  @ManyToOne(() => User, (user) => user.jobs, { onDelete: 'CASCADE' })
  user: User;
}
