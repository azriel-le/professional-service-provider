import { Entity, Column, PrimaryGeneratedColumn, OneToMany ,BeforeInsert, BeforeUpdate } from 'typeorm';
import { Job } from './job/job.entity'; // Ensure the correct import path
import { Freelancer } from './freelancer/freelancer-profile.entity';
import { Hire } from './hire/hire.entity';
import { DeleteDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  work_email: string;

  @Column()
  password: string;

  @Column({ nullable: false, default: '0000000000' }) // Ensure non-nullable and default value
  phone_number: string;

  @Column()
  country: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: 'enum', enum: ['client', 'freelancer', 'admin'] })
  user_type: string;

  @Column({ type: 'enum', enum: ['active', 'suspended', 'deleted'], default: 'active' }) // Add this line
  status: string;

  @OneToMany(() => Job, (job) => job.user, { cascade: true }) 
  jobs: Job[];  // ✅ Now `OneToMany` should work properly

  @OneToMany(() => Freelancer, (freelancer) => freelancer.user, { cascade: true , onDelete: 'CASCADE' })
  freelancers: Freelancer[];

  @OneToMany(() => Hire, (hire) => hire.user , { onDelete: 'CASCADE' })
  hireRequests: Hire[];


    // Validate phone_number before saving
    @BeforeInsert()
    @BeforeUpdate()
    validatePhoneNumber() {
      if (this.phone_number && !/^\d{10}$/.test(this.phone_number)) {
        throw new Error('Phone number must be exactly 10 digits');
      }}
}
