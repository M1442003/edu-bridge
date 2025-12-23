// assignments.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './assignments.entity';
import { ClassEntity } from '../classes/class.entity';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment) private assignmentRepo: Repository<Assignment>,
    @InjectRepository(ClassEntity) private classRepo: Repository<ClassEntity>,
  ) {}

  async create(classId: number, title: string, description: string, dueDate: Date) {
    const cls = await this.classRepo.findOne({ where: { id: classId } });
    if (!cls) throw new NotFoundException('Class not found');

    const assignment = this.assignmentRepo.create({ title, description, dueDate, class: cls });
    return this.assignmentRepo.save(assignment);
  }

  async findByClass(classId: number) {
    return this.assignmentRepo.find({
      where: { class: { id: classId } },
    });
  }
}
