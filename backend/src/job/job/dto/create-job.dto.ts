import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateJobDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  skills: string;

  @IsNotEmpty()
  @IsNumber()
  budget: number;

  @IsNotEmpty()
  @IsString()
  paymentMethod: string;

  @IsNotEmpty()
  @IsString()
  projectDuration: string;

  @IsNotEmpty()
  @IsNumber()
  user_id: number; // Ensure user_id is included
}
