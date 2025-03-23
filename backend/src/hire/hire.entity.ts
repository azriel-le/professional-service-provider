import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user.entity';
import { Freelancer } from '../freelancer/freelancer-profile.entity';

@Entity()
export class Hire {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  freelancerId: number;

  @Column('text')
  projectDetails: string;

  @Column({ type: 'enum', enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.hireRequests , { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Freelancer, (freelancer) => freelancer.hireRequests , { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'freelancerId' })
  freelancer: Freelancer;
}