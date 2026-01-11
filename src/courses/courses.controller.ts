import { Controller, Post, Body, Get } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CourseLevel } from './course.entity';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}
  @Post()
  create(
    @Body() body: {
      name: string;
      level: CourseLevel;
      code: string;
    },
  ) {
    return this.coursesService.create(body);
  }

  @Post('bulk')
  createMany(
    @Body()
    body: {
      name: string;
      level: CourseLevel;
      code: string;
    }[],
  ) {
    return this.coursesService.createMany(body);
  }

  @Get()
  getCourses() {
    return this.coursesService.findAll();
  }
}
