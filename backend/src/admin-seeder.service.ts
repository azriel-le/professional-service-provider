import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class AdminSeederService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>, // Ensure this is correct
  ) {}

  async createAdminIfNotExists() {
    // Check if the admin already exists
    const adminExists = await this.userRepository.findOne({
      where: { work_email: 'admin@gmail.com' },
    });

    if (!adminExists) {
      // If the admin doesn't exist, create it
      const admin = this.userRepository.create({
        first_name: 'Admin',
        last_name: 'User',
        work_email: 'admin@gmail.com',
        password: '$2b$12$mfuFxhBWwtquAKHSXPWnPeEiDstW9bmfqVQpOECL/m6l1H1SLnq9i', // hashed password
        country: 'Global',
        user_type: 'admin',
      });
      await this.userRepository.save(admin);
      console.log('✅ Admin created successfully!');
    } else {
      console.log('✅ Admin already exists!');
    }
  }

  // This method will be called when the application starts
  async onApplicationBootstrap() {
    await this.createAdminIfNotExists();
  }
}