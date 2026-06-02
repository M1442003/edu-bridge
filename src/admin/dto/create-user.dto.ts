import { IsEmail, IsString, MinLength, IsNotEmpty, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { UserRole } from '../../users/user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum([UserRole.STUDENT, UserRole.LECTURER])
  @IsNotEmpty()
  role: UserRole.STUDENT | UserRole.LECTURER;

  @IsOptional()
  @IsString()
  regNo?: string;

  @IsOptional()
  @IsString()
  courseCode?: string;

  @IsOptional()
  @IsNumber()
  year?: number;
}