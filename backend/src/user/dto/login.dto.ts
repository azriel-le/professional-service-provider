import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  work_email: string;

  @IsString()
  password: string;
}
