import { Injectable, ConflictException, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { SignupDto } from './user/dto/signup.dto';
import { LoginDto } from './user/dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Freelancer } from './freelancer/freelancer-profile.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Freelancer) private freelancerRepository: Repository<Freelancer>,
    private jwtService: JwtService,
  ) {}

  // Fetch user details by user_id
  async findUserById(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async createUser(createUserDto: SignupDto): Promise<User> {
    console.log('✅ Received Data:', createUserDto);

    const { work_email, password } = createUserDto;

    try {
      const existingUser = await this.userRepository.findOne({ where: { work_email } });
      if (existingUser) {
        console.log('❌ User Already Exists:', work_email);
        throw new ConflictException('User with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('🟢 Password Hashed Successfully');

      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      console.log('🟢 User Object Created:', user);

      const savedUser = await this.userRepository.save(user);
      console.log('🟢 User Saved Successfully:', savedUser);
      return savedUser;
    } catch (error) {
      console.error('⚠️ Error Saving User:', error.message, error.stack);
      throw new InternalServerErrorException('Failed to save user to the database');
    }
  }

  async getUserById(user_id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: user_id } });
  }
  
  async updateUser(user_id: number, updateData: any): Promise<User> {
    await this.userRepository.update(user_id, updateData);
    const updatedUser = await this.getUserById(user_id);

    if (!updatedUser) {
        throw new NotFoundException('User not found after update');
    }

    return updatedUser;
  }

  async validateUser(loginDto: LoginDto): Promise<{ access_token: string; user_type: string; user_id: number }> {
    const { work_email, password } = loginDto;
  
    // Find user by email
    const user = await this.userRepository.findOne({ where: { work_email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
  
    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
  
    // Generate JWT Token
    const payload = { id: user.id, email: user.work_email, role: user.user_type };
    const access_token = this.jwtService.sign(payload);
  
    return {
      access_token,
      user_type: user.user_type,
      user_id: user.id, // Add user_id to the response
    };
  }

  // Fetch all users (clients and freelancers)
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find({ relations: ['freelancers'] });
  }

  // Fetch users by type (client or freelancer)
  async getUsersByType(userType: string): Promise<User[]> {
    return this.userRepository.find({ where: { user_type: userType }, relations: ['freelancers'] });
  }

  // Fetch user details by ID
  async getUserDetails(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['freelancers'] });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Filter users by status (active, suspended, deleted)
  async filterUsersByStatus(status: string): Promise<User[]> {
    return this.userRepository.find({ where: { status }, relations: ['freelancers'] });
  }

  // Suspend or activate a user account
  async updateUserStatus(userId: number, status: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.status = status;
    return this.userRepository.save(user);
  }


  async changePassword(
    user_id: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    try {
      // Find the user by ID
      const user = await this.userRepository.findOne({ where: { id: user_id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      // Validate the current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the user's password
      user.password = hashedPassword;
      await this.userRepository.save(user);
  
      // Return success message
      return { message: 'Password updated successfully!' };
    } catch (error) {
      console.error('Error changing password:', error.message, error.stack);
      throw new InternalServerErrorException('Failed to change password');
    }
  }

  // Delete a user account
  async deleteUser(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    // Soft delete the user
    await this.userRepository.remove(user);
  }}