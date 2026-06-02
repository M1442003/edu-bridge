import { IsString, IsNotEmpty, IsNumber, MinLength, IsOptional, IsArray } from 'class-validator';

export class CreateAnnouncementDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  content: string;

  @IsNumber()
  moduleId: number;

  @IsOptional()
  @IsNumber()
  classId?: number;

  @IsOptional()
  @IsArray()
  classIds?: number[];

  @IsOptional()
  @IsString()
  priority?: string;
}