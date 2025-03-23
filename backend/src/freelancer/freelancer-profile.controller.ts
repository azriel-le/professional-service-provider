import { Controller, Post, Body, UploadedFile, UseInterceptors, InternalServerErrorException, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FreelancerProfileService } from './freelancer-profile.service';
import { CreateFreelancerDto } from './dto/create-freelancer.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Freelancer } from './freelancer-profile.entity';

@Controller('freelancers')
export class FreelancerProfileController {
  constructor(private readonly freelancerService: FreelancerProfileService) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('profilePicture', {
    storage: diskStorage({
      destination: './uploads', // Save images in "uploads" folder
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
      },
    }),
  }))
  async createFreelancer(
    @UploadedFile() file: Express.Multer.File, // Handle uploaded file
    @Body() createFreelancerDto: CreateFreelancerDto, // Handle other form fields
  ): Promise<any> {
    try {
      console.log('Received Form Data:', createFreelancerDto); // Log form data
      console.log('Received File:', file); // Log uploaded file

      if (file) {
        createFreelancerDto.profilePicture = `/uploads/${file.filename}`; // Save file path
      }

      const freelancer = await this.freelancerService.createFreelancer(createFreelancerDto);
      return { message: 'Freelancer profile created successfully!', freelancer };
    } catch (error) {
      console.error('Error creating freelancer:', error.message, error.stack);
      throw new InternalServerErrorException('Failed to create freelancer');
    }
  }

  // Add this new endpoint to check freelancer profile
  @Get('profile/:user_id')
  async getFreelancerProfile(@Param('user_id') user_id: number): Promise<{ profile_completed: boolean, freelancer_id: number | null }> {
    try {
      const freelancer = await this.freelancerService.getFreelancerProfile(user_id);
      console.log("Freelancer object from database:", freelancer); // Debugging
      return { 
        profile_completed: !!freelancer, 
        freelancer_id: freelancer ? freelancer.id : null
      };
    } catch (error) {
      throw new HttpException('Failed to check freelancer profile', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('all')
  async getAllFreelancers(): Promise<Partial<Freelancer>[]> {
    try {
      const freelancers = await this.freelancerService.getAllFreelancers();
      return freelancers; // Return the mapped freelancers
    } catch (error) {
      console.error('Error fetching freelancers:', error); // Log the error
      throw new HttpException(
        'Failed to fetch freelancers',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Admin-specific routes
  @Get('admin/freelancers') // Get all freelancers
  async getAllFreelancersAdmin(): Promise<Freelancer[]> {
    return this.freelancerService.getAllFreelancers();
  }

  @Get('admin/freelancer/:id') // Get freelancer details by ID
  async getFreelancerDetailsAdmin(@Param('id') id: number): Promise<Freelancer> {
    return this.freelancerService.getFreelancerDetails(id);
  }
}