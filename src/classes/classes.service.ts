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
    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      throw new Error('studentIds must be a non-empty array');
    }

    const cls = await this.classRepo.findOne({
      where: { id: classId },
      relations: ['students'],
    });
    if (!cls) throw new NotFoundException('Class not found');

    const students = await this.userRepo.find({
      where: { id: In(studentIds), role: UserRole.STUDENT },
    });

    const existingIds = new Set(cls.students?.map((s) => s.id) || []);
    cls.students = [...(cls.students || []), ...students.filter(s => !existingIds.has(s.id))];

    return this.classRepo.save(cls);
  }

  async assignModules(classId: number, moduleIds: number[]) {
    if (!Array.isArray(moduleIds) || moduleIds.length === 0) {
      throw new Error('moduleIds must be a non-empty array');
    }

    const cls = await this.classRepo.findOne({
      where: { id: classId },
      relations: ['modules'],
    });
    if (!cls) throw new NotFoundException('Class not found');

    const modules = await this.moduleRepo.find({
      where: { id: In(moduleIds) },
    });

  
    const existingIds = new Set(cls.modules?.map((m) => m.id) || []);
    cls.modules = [...(cls.modules || []), ...modules.filter(m => !existingIds.has(m.id))];

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
