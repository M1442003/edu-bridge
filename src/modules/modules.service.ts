import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module } from './module.entity';
import { Course } from '../courses/course.entity';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Module)
    private moduleRepo: Repository<Module>,

    @InjectRepository(Course)
    private courseRepo: Repository<Course>,
  ) {}

  async create(name: string, courseId: number) {
    const course = await this.courseRepo.findOne({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const module = this.moduleRepo.create({
      name,
      course,
    });

    return this.moduleRepo.save(module);
  }

  findAll() {
    return this.moduleRepo.find({
      relations: ['course'],
    });
  }

  async findByCourse(courseId: number) {
  const course = await this.courseRepo.findOne({
    where: { id: courseId },
  });

  if (!course) {
    throw new NotFoundException('Course not found');
  }

  return this.moduleRepo.find({
    where: {
      course: { id: courseId },
    },
    relations: ['course'],
  });
}

}