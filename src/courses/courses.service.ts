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

  create(course: Partial<Course>) {
    return this.courseRepo.save(course);
  }

  createMany(courses: Partial<Course>[]) {
    return this.courseRepo.save(courses);
  }

  findAll() {
    return this.courseRepo.find();
  }
}

