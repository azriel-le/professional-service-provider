import { Entity, PrimaryGeneratedColumn, Column, OneToMany,JoinColumn , ManyToOne } from 'typeorm';
import { User } from '../user.entity';
import { Hire } from '../hire/hire.entity';

@Entity()
export class Freelancer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  skills: string;

  @Column()
  experienceLevel: string;

  @Column('decimal')
  hourlyRate: number;

  @Column('text')
  bio: string;

  @Column({ nullable: true })
  portfolio: string;

  @Column()
  availability: string;

  @Column()
  languages: string;

  @Column()
  location: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Column('int', { default: 1 })
  rating: number;

  @Column({ default: false }) // Add this field
  profile_completed: boolean;

  @Column()
  user_id: number;

  @ManyToOne(() => User, (user) => user.freelancers, { eager: true , onDelete: 'CASCADE' }) // Enable eager loading
  @JoinColumn({ name: 'user_id' }) // Explicitly specify the join column
  user: User;

  @OneToMany(() => Hire, (hire) => hire.freelancer)
  hireRequests: Hire[];
}
