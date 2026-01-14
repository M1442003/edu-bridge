import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module } from './module.entity';
import { Course } from '../courses/course.entity';
import { CreateModuleDto } from './dto/module.dto';
import { Semester } from '../common/enums/semester.enum';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Module)
    private moduleRepo: Repository<Module>,

    @InjectRepository(Course)
    private courseRepo: Repository<Course>,
  ) { }

  async create(name: string, courseId: number, semester: Semester, year: number) {
    const course = await this.courseRepo.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');

    const module = this.moduleRepo.create({
      name,
      course,
      semester,
      year,
    });

    return this.moduleRepo.save(module);
  }

  async createBulk(modules: CreateModuleDto[]) {
    const results: { name: string; success: boolean; id?: number; reason?: string }[] = [];

    for (const dto of modules) {
      const course = await this.courseRepo.findOne({ where: { id: dto.courseId } });
      if (!course) {
        results.push({ name: dto.name, success: false, reason: 'Course not found' });
        continue;
      }

      const module = this.moduleRepo.create({
        name: dto.name,
        code: dto.code,
        course,
        semester: dto.semester as Semester,
        year: dto.year,
      });

      await this.moduleRepo.save(module);
      results.push({ name: dto.name, success: true, id: module.id });
    }

    return results;
  }

  findAll() {
    return this.moduleRepo.find({ relations: ['course'] });
  }

  async findByCourse(courseId: number) {
    const course = await this.courseRepo.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');

    return this.moduleRepo.find({
      where: { course: { id: courseId } },
      relations: ['course'],
    });
  }
}
