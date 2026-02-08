import { IsString, IsNotEmpty, IsNumber, MinLength } from 'class-validator';

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

  @IsNumber()
  classId: number;
}