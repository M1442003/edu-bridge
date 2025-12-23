import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';

@Controller('assignments')
export class AssignmentsController {
  constructor(private assignmentsService: AssignmentsService) {}

  @Post(':classId')
  create(
    @Param('classId') classId: number,
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('dueDate') dueDate: string,
  ) {
    return this.assignmentsService.create(classId, title, description, new Date(dueDate));
  }

  @Get('class/:classId')
  findByClass(@Param('classId') classId: number) {
    return this.assignmentsService.findByClass(classId);
  }
}
