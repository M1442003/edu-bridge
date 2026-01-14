import { IsString, IsNotEmpty, IsEnum, IsInt } from 'class-validator';
import { Semester } from '../../common/enums/semester.enum';

export class CreateModuleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsEnum(Semester)
  semester: Semester;

  @IsInt()
  year: number;

  @IsInt()
  courseId: number;
}