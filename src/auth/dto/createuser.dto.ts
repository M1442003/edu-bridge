import { IsEmail, IsNotEmpty, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../users/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  regNo: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsString()
  courseCode?: string;

  @IsOptional()
  year?: number;

  @IsOptional()
  classId?: number;

  @IsOptional()
  moduleIds?: number[];
}