import {
  Controller,
  Post,
  Param,
  Body,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { assignmentStorage } from './multer.config';
import { AssignmentsService } from './assignments.service';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly service: AssignmentsService) {}

  @Post(':classId')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: assignmentStorage,
    }),
  )
  create(
    @Param('classId') classId: number,
    @Body() body,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.service.create(
      classId,
      body.title,
      body.description,
      new Date(body.dueDate),
      files,
    );
  }
}