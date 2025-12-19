import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
 import { Course, CourseLevel } from './course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepo: Repository<Course>,
  ) {}

create(name: string, level: CourseLevel) {
  const course = this.courseRepo.create({ name, level });
  return this.courseRepo.save(course);
}


  findAll() {
    return this.courseRepo.find();
  }
}
