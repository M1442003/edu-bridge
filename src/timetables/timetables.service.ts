import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Timetable } from './timetable.entity';
import { User } from '../users/user.entity';
import { ClassEntity } from '../classes/class.entity';
import { Module as ModuleEntity } from 'src/modules/module.entity';

@Injectable()
export class TimetablesService {
  private normalizeVenue(venue?: string): string {
    return venue?.trim() ? venue.trim() : 'TBD';
  }

  constructor(
    @InjectRepository(Timetable)
    private timetableRepo: Repository<Timetable>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(ClassEntity)
    private classRepo: Repository<ClassEntity>,
    @InjectRepository(ModuleEntity)
    private moduleRepo: Repository<ModuleEntity>,
  ) { }

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

    let module: ModuleEntity | undefined = undefined;
    if (body.moduleId) {
      module = await this.moduleRepo.findOne({ where: { id: body.moduleId } }) ?? undefined;
    }

    const timetable = this.timetableRepo.create({
      lecturer,
      class: cls,
      module,
      dayOfWeek: body.dayOfWeek,
      startTime: body.startTime,
      endTime: body.endTime,
      venue: this.normalizeVenue(body.venue),
    });
    return this.timetableRepo.save(timetable);
  }

 async findAll() {
  return this.timetableRepo.find({
    relations: ['lecturer', 'class', 'class.course', 'module'],
    order: { dayOfWeek: 'ASC', startTime: 'ASC' },
  });
}

  async findByClass(classId: number) {
    return this.timetableRepo.find({
      where: { class: { id: classId } },
      relations: ['lecturer', 'class', 'class.course', 'module'],
      order: { dayOfWeek: 'ASC', startTime: 'ASC' },
    });
  }

  async findByLecturer(lecturerId: number) {
    return this.timetableRepo.find({
      where: { lecturer: { id: lecturerId } },
      relations: ['lecturer', 'class', 'class.course', 'class.students', 'module'],
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

    if (body.venue !== undefined) {
      timetable.venue = this.normalizeVenue(body.venue);
    }

    Object.assign(timetable, { ...body, venue: timetable.venue });
    return this.timetableRepo.save(timetable);
  }

  async delete(id: number) {
    const result = await this.timetableRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Timetable not found');
    return { message: 'Timetable deleted' };
  }
}