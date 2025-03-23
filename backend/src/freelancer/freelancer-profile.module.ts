import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Freelancer } from './freelancer-profile.entity';
import { FreelancerProfileService } from './freelancer-profile.service';
import { FreelancerProfileController } from './freelancer-profile.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Freelancer])], // ✅ Register Freelancer entity
  controllers: [FreelancerProfileController], // ✅ Register controller
  providers: [FreelancerProfileService], // ✅ Register service
  exports: [FreelancerProfileService], // ✅ Allow use in other modules
})
export class FreelancerProfileModule {}
