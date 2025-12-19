import { Controller, Post, Body, Get } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CourseLevel } from './course.entity';
import { Course } from './course.entity';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}
  
@Post()
createCourse(
  @Body('name') name: string,
  @Body('level') level: CourseLevel,
) {
  return this.coursesService.create(name, level);
}

  @Get()
  getCourses() {
    return this.coursesService.findAll();
  }
}
