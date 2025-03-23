import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HireController } from './hire.controller';
import { HireService } from './hire.service';
import { Hire } from './hire.entity';
import { User } from '../user.entity'; // Import the User entity
import { Freelancer } from '../freelancer/freelancer-profile.entity'; // Import the Freelancer entity

@Module({
  imports: [
    // Register the Hire entity and related entities (User and Freelancer)
    TypeOrmModule.forFeature([Hire, User, Freelancer]),
  ],
  controllers: [HireController], // Register the HireController
  providers: [HireService], // Register the HireService
  exports: [HireService], // Export HireService if needed in other modules
})
export class HireModule {}