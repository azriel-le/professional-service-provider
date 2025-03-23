import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsEmail()
  work_email: string;

  @MinLength(6)
  password: string;

  @IsNotEmpty()
  country: string;

  @IsEnum(['client', 'freelancer'])
  user_type: 'client' | 'freelancer';
}
