import { Body, Controller, Post, HttpException, HttpStatus, Get, Put, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { SignupDto } from './user/dto/signup.dto';
import { LoginDto } from './user/dto/login.dto';
import { FreelancerProfileService } from './freelancer/freelancer-profile.service';

@Controller('users') // Ensure the base route is 'users'
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly freelancerService: FreelancerProfileService,
  ) {}

  @Post('signup')
  async signUp(@Body() createUserDto: SignupDto): Promise<{ message: string; user: User }> {
    try {
      const user = await this.userService.createUser(createUserDto);
      return { message: 'Account successfully created!', user };
    } catch (error) {
      throw new HttpException('Signup failed: ' + error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ access_token: string; user_type: string; user_id: number }> {
    try {
      const { access_token, user_type, user_id } = await this.userService.validateUser(loginDto);
      return { access_token, user_type, user_id };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('freelancer-profile/:user_id') // Route: GET /users/freelancer-profile/:user_id
  async checkFreelancerProfile(@Param('user_id') user_id: number): Promise<{ profile_completed: boolean }> {
    try {
      const freelancer = await this.freelancerService.getFreelancerProfile(user_id);
      return { profile_completed: !!freelancer };
    } catch (error) {
      throw new HttpException('Failed to check freelancer profile', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('profile/:user_id')
  async getCombinedProfile(@Param('user_id') user_id: number): Promise<any> {
    try {
      const user = await this.userService.getUserById(user_id);
      const freelancer = await this.freelancerService.getFreelancerProfile(user_id);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return {
        user: {
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.work_email,
          password: user.password,
          country: user.country,
          phoneNumber:user.phone_number,
        },
        freelancer: freelancer || null, // Return freelancer data if it exists
      };
    } catch (error) {
      throw new HttpException('Failed to fetch profile data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('profile/:user_id') // Define the PUT endpoint
  async updateCombinedProfile(
    @Param('user_id') user_id: number, // Extract user_id from the URL
    @Body() updateData: any, // Extract the request body
  ): Promise<any> {
    try {
      // Update user data
      const updatedUser = await this.userService.updateUser(user_id, updateData.user);

      // Update freelancer data
      const updatedFreelancer = await this.freelancerService.updateFreelancerProfile(user_id, updateData.freelancer);

      // Return success response
      return {
        message: 'Profile updated successfully!',
        user: updatedUser,
        freelancer: updatedFreelancer,
      };
    } catch (error) {
      // Handle errors
      throw new HttpException('Failed to update profile', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Admin-specific endpoints
  @Get('admin/users') // Get all users (clients and freelancers)
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get('admin/users/:type') // Get users by type (client or freelancer)
  async getUsersByType(@Param('type') type: string): Promise<User[]> {
    return this.userService.getUsersByType(type);
  }

  @Get('admin/users/status/:status') // Filter users by status (active, suspended, deleted)
  async filterUsersByStatus(@Param('status') status: string): Promise<User[]> {
    return this.userService.filterUsersByStatus(status);
  }

  @Get('admin/user/:id') // Get user details by ID
  async getUserDetails(@Param('id') id: number): Promise<User> {
    return this.userService.getUserDetails(id);
  }

  @Put('admin/user/:id/status') // Suspend or activate a user account
  async updateUserStatus(@Param('id') id: number, @Query('status') status: string): Promise<User> {
    return this.userService.updateUserStatus(id, status);
  }

  @Delete('admin/user/:id') // Delete a user account
  async deleteUser(@Param('id') id: number): Promise<void> {
    return this.userService.deleteUser(id);
  }



  @Put('change-password/:user_id') // Define the PUT endpoint for changing password
async changePassword(
  @Param('user_id') user_id: number, // Extract user_id from the URL
  @Body() changePasswordDto: { currentPassword: string; newPassword: string }, // Extract the request body
): Promise<{ message: string }> {
  try {
    const { currentPassword, newPassword } = changePasswordDto;

    // Call the service to change the password
    return await this.userService.changePassword(user_id, currentPassword, newPassword);
  } catch (error) {
    // Handle errors
    throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  }
}

}