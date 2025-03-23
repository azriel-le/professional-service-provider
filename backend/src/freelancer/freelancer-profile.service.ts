import { Injectable, ConflictException, InternalServerErrorException, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Freelancer } from './freelancer-profile.entity';
import { CreateFreelancerDto } from './dto/create-freelancer.dto';

@Injectable()
export class FreelancerProfileService {
  constructor(
    @InjectRepository(Freelancer)
    private freelancerRepository: Repository<Freelancer>,
  ) {}

  async createFreelancer(data: CreateFreelancerDto): Promise<Freelancer> {
    // Check if a freelancer with the same user_id already exists
    const existingFreelancer = await this.freelancerRepository.findOne({
      where: { user_id: data.user_id },
    });

    if (existingFreelancer) {
      throw new ConflictException('A freelancer profile already exists for this user.');
    }

    try {
      // Set profile_completed to true when creating the profile
      const freelancer = this.freelancerRepository.create({
        ...data,
        profile_completed: true,
      });
      return await this.freelancerRepository.save(freelancer);
    } catch (error) {
      console.error('❌ Error creating freelancer:', error);
      throw new InternalServerErrorException('Failed to create freelancer');
    }
  }

  // Add a method to check if a freelancer profile exists for a user
  async getFreelancerProfile(user_id: number): Promise<Freelancer | null> {
    return this.freelancerRepository.findOne({ where: { user_id } });
  }

  async updateFreelancerProfile(user_id: number, updateData: any): Promise<Freelancer> {
    const freelancer = await this.freelancerRepository.findOne({ where: { user_id } });
    if (!freelancer) {
      throw new HttpException('Freelancer profile not found', HttpStatus.NOT_FOUND);
    }

    // Update the freelancer profile with the provided updateData
    await this.freelancerRepository.update(freelancer.id, updateData);

    // Fetch and return the updated freelancer profile
    const updatedFreelancer = await this.freelancerRepository.findOne({ where: { user_id } });

    // Handle the case where no freelancer is found after update
    if (!updatedFreelancer) {
      throw new HttpException('Failed to retrieve updated freelancer profile', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return updatedFreelancer;
  }

  async getAllFreelancers(): Promise<Freelancer[]> {
    const freelancers = await this.freelancerRepository.find({
      relations: ['user'], // Ensure 'user' relation is loaded
      order: { rating: 'DESC' },
    });

    console.log('Raw Freelancer Data:', JSON.stringify(freelancers, null, 2)); // Debugging step

    return freelancers.map(freelancer => {
      console.log(`Freelancer ${freelancer.id} - User:`, freelancer.user); // Debugging step

      const fullName = freelancer.user
        ? `${freelancer.user.first_name} ${freelancer.user.last_name}`.trim()
        : 'Unknown';

      console.log(`Full Name for Freelancer ${freelancer.id}:`, fullName); // Debugging step

      return {
        ...freelancer,
        fullName, // Ensure full name is returned
      };
    });
  }

  // Fetch all freelancers with user details
  async getAllFreelancersWithUserDetails(): Promise<Freelancer[]> {
    return this.freelancerRepository.find({ relations: ['user'] });
  }

  // Fetch freelancer details by ID
  async getFreelancerDetails(freelancerId: number): Promise<Freelancer> {
    const freelancer = await this.freelancerRepository.findOne({
      where: { id: freelancerId },
      relations: ['user'],
    });
    if (!freelancer) {
      throw new NotFoundException('Freelancer not found');
    }
    return freelancer;
  }
}