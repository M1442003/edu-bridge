import {
  Controller,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AssignmentsService } from './assignments.service';
import { assignmentStorage } from './multer.config';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  /**
   * Lecturer posts assignment to a module & class
   */
  @Post()
  @Roles(UserRole.LECTURER)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: assignmentStorage,
    }),
  )
  create(
    @Body() dto: CreateAssignmentDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.assignmentsService.create(dto, files);
  }
}
