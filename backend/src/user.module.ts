import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { Freelancer } from './freelancer/freelancer-profile.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FreelancerProfileService } from './freelancer/freelancer-profile.service';
import { AdminSeederService } from './admin-seeder.service'; // Ensure this is imported

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Freelancer]), // Include User and Freelancer entities
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-secret-key',
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [UserService, FreelancerProfileService, AdminSeederService], // Add AdminSeederService here
  controllers: [UserController],
  exports: [TypeOrmModule.forFeature([User])], // Export UserRepository
})
export class UserModule {}