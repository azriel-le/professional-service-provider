import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './job.entity';
import { CreateJobDto } from './job/dto/create-job.dto';

@Injectable()
export class JobService {
  constructor(@InjectRepository(Job) private jobRepository: Repository<Job>) {}

  async createJob(createJobDto: CreateJobDto): Promise<Job> {
    try {
      const job = this.jobRepository.create({
        title: createJobDto.title,
        description: createJobDto.description,
        skills: createJobDto.skills,
        budget: createJobDto.budget,
        paymentMethod: createJobDto.paymentMethod,
        projectDuration: createJobDto.projectDuration,
        user_id: createJobDto.user_id, // Associate job with user ID
      });

      return await this.jobRepository.save(job);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('A job with this title already exists.');
      }
      throw error;
    }
  }

  // Find jobs that match a freelancer's skills
  async findJobsBySkills(skills: string[]): Promise<Job[]> {
    return this.jobRepository
      .createQueryBuilder('job')
      .where('job.skills && ARRAY[:...skills]', { skills }) // Match skills using PostgreSQL array overlap
      .getMany();
  }
}