import { Controller, Post, Get, Body, Param, Delete, Patch, UseGuards, Request } from '@nestjs/common';
import { TimetablesService } from './timetables.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('timetables')
export class TimetablesController {
  constructor(private readonly service: TimetablesService) { }

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.service.findAll();
  }

  @Get('class/:classId')
  @UseGuards(AuthGuard('jwt'))
  findByClass(@Param('classId') classId: string) {
    return this.service.findByClass(parseInt(classId));
  }

  @Get('lecturer/:lecturerId')
  @UseGuards(AuthGuard('jwt'))
  findByLecturer(@Param('lecturerId') lecturerId: string) {
    return this.service.findByLecturer(parseInt(lecturerId));
  }

  @Post('my')
  @UseGuards(AuthGuard('jwt'))
  createMine(@Request() req, @Body() body: any) {
    const user = req.user;
    return this.service.create({
      ...body,
      lecturerId: user.id,
    });
  }

  @Get('my')
  @UseGuards(AuthGuard('jwt'))
  findMine(@Request() req) {
    const user = req.user;
    if (user.role === 'LECTURER') {
      return this.service.findByLecturer(user.id);
    }
    if (user.classId) {
      return this.service.findByClass(user.classId);
    }
    return [];
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(parseInt(id), body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id') id: string) {
    return this.service.delete(parseInt(id));
  }
}