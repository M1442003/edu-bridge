// announcements.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './announcements.entity';
import { ClassEntity } from '../classes/class.entity';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement) private announcementRepo: Repository<Announcement>,
    @InjectRepository(ClassEntity) private classRepo: Repository<ClassEntity>,
  ) {}

  async create(classId: number, title: string, content: string) {
    const cls = await this.classRepo.findOne({ where: { id: classId } });
    if (!cls) throw new NotFoundException('Class not found');

    const announcement = this.announcementRepo.create({ title, content, class: cls });
    return this.announcementRepo.save(announcement);
  }

  async findByClass(classId: number) {
    return this.announcementRepo.find({
      where: { class: { id: classId } },
    });
  }
}
