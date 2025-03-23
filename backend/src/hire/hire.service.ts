import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hire } from './hire.entity';
import { CreateHireDto } from './hire/dto/create-hire.dto';
import { UpdateHireStatusDto } from './hire/dto/update-hire-status.dto';

@Injectable()
export class HireService {
  constructor(
    @InjectRepository(Hire)
    private hireRepository: Repository<Hire>,
  ) {}

  // Create a new hire request
  async createHireRequest(createHireDto: CreateHireDto): Promise<Hire> {
    const hire = this.hireRepository.create(createHireDto);
    return this.hireRepository.save(hire);
  }

  // Fetch all hire requests
  async getAllHireRequests(): Promise<Hire[]> {
    return this.hireRepository.find({
      relations: ['user', 'freelancer'], // Include client and freelancer details
    });
  }

  // Fetch hire requests for a freelancer
  async getHireRequestsByFreelancer(freelancerId: number): Promise<Hire[]> {
    return this.hireRepository.find({
      where: { freelancerId },
      relations: ['user'], // Include client details
    });
  }

  // Fetch hire requests for a client
  async getHireRequestsByClient(userId: number): Promise<Hire[]> {
    return this.hireRepository.find({
      where: { userId },
      relations: ['freelancer'], // Include freelancer details
    });
  }

  // Update the status of a hire request
  async updateHireStatus(id: number, updateHireStatusDto: UpdateHireStatusDto): Promise<Hire> {
    await this.hireRepository.update(id, { status: updateHireStatusDto.status });

    // Fetch and return the updated hire request
    const updatedHire = await this.hireRepository.findOne({
      where: { id },
      relations: ['user', 'freelancer'], // Include client and freelancer details
    });

    if (!updatedHire) {
      throw new NotFoundException('Hire request not found');
    }

    return updatedHire;
  }
}