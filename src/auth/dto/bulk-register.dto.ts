import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class BulkRegisterDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  regNo?: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  courseCode?: string;

  @IsOptional()
  year?: number;
}