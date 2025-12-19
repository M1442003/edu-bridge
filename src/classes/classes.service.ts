import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ClassEntity } from './class.entity';
import { Course } from '../courses/course.entity';
import { User, UserRole } from '../users/user.entity';
import { Module as CourseModule } from '../modules/module.entity';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(ClassEntity)
    private classRepo: Repository<ClassEntity>,

    @InjectRepository(Course)
    private courseRepo: Repository<Course>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(CourseModule)
    private moduleRepo: Repository<CourseModule>,
  ) {}

  async create(name: string, year: number, courseId: number) {
    const course = await this.courseRepo.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');

    const cls = this.classRepo.create({ name, year, course });
    return this.classRepo.save(cls);
  }

  async addStudents(classId: number, studentIds: number[]) {
    const cls = await this.classRepo.findOne({
      where: { id: classId },
      relations: ['students'],
    });
    if (!cls) throw new NotFoundException('Class not found');

    const students = await this.userRepo.find({
      where: { id: In(studentIds), role: UserRole.STUDENT },
    });

    cls.students = students;
    return this.classRepo.save(cls);
  }

  async assignModules(classId: number, moduleIds: number[]) {
    const cls = await this.classRepo.findOne({
      where: { id: classId },
      relations: ['modules'],
    });
    if (!cls) throw new NotFoundException('Class not found');

    const modules = await this.moduleRepo.find({
      where: { id: In(moduleIds) },
    });

    cls.modules = modules;
    return this.classRepo.save(cls);
  }

  async findAll() {
    return this.classRepo.find({ relations: ['course', 'students', 'modules'] });
  }

  async findByCourse(courseId: number) {
    return this.classRepo.find({
      where: { course: { id: courseId } },
      relations: ['course', 'students', 'modules'],
    });
  }
}
