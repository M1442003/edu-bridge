import { IsEmail, IsNotEmpty, MinLength, IsNumber, Matches } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @Matches(/^\d{13}$/)
  regNo: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsNotEmpty()
  courseCode: string;

  @IsNumber()
  year: number;
}