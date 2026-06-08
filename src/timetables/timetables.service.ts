import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Timetable } from './timetable.entity';
import { User } from '../users/user.entity';
import { ClassEntity } from '../classes/class.entity';

@Injectable()
export class TimetablesService {
  constructor(
    @InjectRepository(Timetable)
    private timetableRepo: Repository<Timetable>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(ClassEntity)
    private classRepo: Repository<ClassEntity>,
  ) {}

  async create(body: {
    lecturerId: number;
    classId: number;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    venue: string;
    moduleId?: number;
  }) {
    const lecturer = await this.userRepo.findOne({ where: { id: body.lecturerId } });
    const cls = await this.classRepo.findOne({ where: { id: body.classId } });
    if (!lecturer || !cls) throw new NotFoundException('Lecturer or Class not found');

    const timetable = this.timetableRepo.create({
      lecturer,
      class: cls,
      dayOfWeek: body.dayOfWeek,
      startTime: body.startTime,
      endTime: body.endTime,
      venue: body.venue,
    });
    return this.timetableRepo.save(timetable);
  }

  async findAll() {
    return this.timetableRepo.find({
      relations: ['lecturer', 'class', 'class.course'],
      order: { dayOfWeek: 'ASC', startTime: 'ASC' },
    });
  }

  async findByClass(classId: number) {
    return this.timetableRepo.find({
      where: { class: { id: classId } },
      relations: ['lecturer', 'class', 'class.course'],
      order: { dayOfWeek: 'ASC', startTime: 'ASC' },
    });
  }

  async findByLecturer(lecturerId: number) {
    return this.timetableRepo.find({
      where: { lecturer: { id: lecturerId } },
      relations: ['lecturer', 'class', 'class.course'],
      order: { dayOfWeek: 'ASC', startTime: 'ASC' },
    });
  }

  async update(id: number, body: Partial<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    venue: string;
  }>) {
    const timetable = await this.timetableRepo.findOne({ where: { id } });
    if (!timetable) throw new NotFoundException('Timetable not found');
    Object.assign(timetable, body);
    return this.timetableRepo.save(timetable);
  }

  async delete(id: number) {
    const result = await this.timetableRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Timetable not found');
    return { message: 'Timetable deleted' };
  }
}