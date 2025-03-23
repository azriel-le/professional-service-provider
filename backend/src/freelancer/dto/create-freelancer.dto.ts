import { IsNotEmpty, IsNumber, IsString, IsOptional, IsBoolean, IsDecimal } from 'class-validator';

export class CreateFreelancerDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  hourlyRate: number;

  @IsNotEmpty()
  @IsString()
  bio: string;

  @IsOptional()
  @IsString()
  portfolio?: string;

  @IsNotEmpty()
  @IsString()
  languages: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsNotEmpty()
  @IsString()
  experienceLevel: string;

  @IsNotEmpty()
  @IsString()
  skills: string;

  @IsNotEmpty()
  @IsString()
  availability: string;

  @IsOptional()
  @IsBoolean()
  profile_completed?: boolean;

  @IsNotEmpty()
  @IsNumber()
  user_id: number;
}