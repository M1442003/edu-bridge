import { IsInt, IsString, IsDateString } from 'class-validator';

export class CreateAssignmentDto {
  @IsInt()
  classId: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  dueDate: string;
}
