import { Controller, Post, Body, Get, Param, UseGuards, Request, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import AssignmentsService from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('files'))
  create(
    @Body() dto: CreateAssignmentDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.assignmentsService.create(dto, files);
  }

  @Get('class/:classId')
  @UseGuards(AuthGuard('jwt'))
  findByClass(@Param('classId') classId: string) {
    return this.assignmentsService.findByClass(parseInt(classId));
  }

  @Get('dashboard')
  @UseGuards(AuthGuard('jwt'))
  async getDashboardAssignments(@Request() req) {
    const user = req.user;
    if (user.classId) {
      return this.assignmentsService.getUpcomingAssignments(user.classId, 5);
    }
    return [];
  }

  @Get('upcoming')
  @UseGuards(AuthGuard('jwt'))
  async getUpcoming(@Request() req) {
    const user = req.user;
    if (user.classId) {
      return this.assignmentsService.getUpcomingAssignments(user.classId, 10);
    }
    return [];
  }

  @Get('student')
  @UseGuards(AuthGuard('jwt'))
  async findForStudent(@Request() req) {
    const user = req.user;
    if (user.classId) {
      return this.assignmentsService.findForStudent(user.classId);
    }
    return [];
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findById(@Param('id') id: string) {
    return this.assignmentsService.findById(parseInt(id));
  }
}