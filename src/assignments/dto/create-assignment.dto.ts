import { IsInt, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateAssignmentDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  dueDate: Date;

  @IsInt()
  moduleId: number;

  @IsInt()
  classId: number;

  @IsOptional()
  attachments?: {
    originalName: string;
    fileName: string;
    mimeType: string;
    size: number;
  }[];
}
