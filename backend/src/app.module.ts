import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { UserModule } from './user.module'; // Ensure UserModule is imported
import { JobModule } from './job/job.module';
import { Job } from './job/job.entity';
import { FreelancerProfileModule } from './freelancer/freelancer-profile.module';
import { Freelancer } from './freelancer/freelancer-profile.entity';
import { Hire } from './hire/hire.entity';
import { HireModule } from './hire/hire.module';
import { AdminSeederService } from './admin-seeder.service'; // Ensure AdminSeederService is imported
import { JwtModule } from '@nestjs/jwt'; // Import JwtModule

import { UserService } from './user.service';
import { FreelancerProfileService } from './freelancer/freelancer-profile.service';
import { UserController } from './user.controller';
import { FreelancerProfileController } from './freelancer/freelancer-profile.controller';

@Module({
  imports: [
    // Load environment variables from .env file
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule available globally
      envFilePath: '.env', // Ensure this path is correct
    }),

    // Configure TypeORM asynchronously using ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule to use ConfigService
      inject: [ConfigService], // Inject ConfigService
      useFactory: (configService: ConfigService) => {
        // Retrieve database credentials from environment variables
        const host = configService.get<string>('DATABASE_HOST');
        const port = configService.get<number>('DATABASE_PORT');
        const username = configService.get<string>('DATABASE_USER');
        const password = configService.get<string>('DATABASE_PASSWORD');
        const database = configService.get<string>('DATABASE_NAME');

        // 🟢 Debugging Logs for Database Connection
        console.log('🟢 Database Connection Details:');
        console.log(`  - Host: ${host}`);
        console.log(`  - Port: ${port}`);
        console.log(`  - User: ${username}`);
        console.log(`  - Database: ${database}`);
        console.log(`  - Password: ${password ? '*****' : 'MISSING'}`); // Masked password for security

        return {
          type: 'mysql', // Database type (MySQL)
          host,
          port,
          username,
          password,
          database,
          entities: [User, Job, Freelancer, Hire], // Add your entities here
          synchronize: true, // ⚠️ Do not use in production
          autoLoadEntities: true, // Automatically load entities from all modules
        };
      },
    }),

    // Configure JwtModule
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule to use ConfigService
      inject: [ConfigService], // Inject ConfigService
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Retrieve JWT secret from .env
        signOptions: { expiresIn: '1h' }, // Token expiration time
      }),
    }),

    // Import UserModule
    UserModule, // Ensure UserModule is imported
    JobModule,
    FreelancerProfileModule,
    HireModule,
  ],
  providers: [AdminSeederService, UserService, FreelancerProfileService], // Add AdminSeederService here
  controllers: [UserController, FreelancerProfileController],
})
export class AppModule {}