import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './announcements.entity';
import { ClassEntity } from '../classes/class.entity';
import { User } from '../users/user.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private announcementRepo: Repository<Announcement>,
    @InjectRepository(ClassEntity)
    private classRepo: Repository<ClassEntity>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(dto: CreateAnnouncementDto): Promise<Announcement> {
    const classEntity = await this.classRepo.findOne({
      where: { id: dto.classId },
      relations: ['students'],
    });

    if (!classEntity) throw new NotFoundException('Class not found');

    const announcement = this.announcementRepo.create({
      title: dto.title,
      content: dto.content,
      class: classEntity,
    });
    await this.announcementRepo.save(announcement);

    const emails = classEntity.students.map((s) => s.email);
    if (emails.length) {
      await this.sendEmail(emails, dto.title, dto.content);
    }

    return announcement;
  }

  async findByClass(classId: number): Promise<Announcement[]> {
    return this.announcementRepo.find({
      where: { class: { id: classId } },
      order: { createdAt: 'DESC' },
    });
  }

  private async sendEmail(to: string[], subject: string, text: string) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.example.com',
        port: 587,
        secure: false,
        auth: {
          user: 'your_email@example.com',
          pass: 'your_email_password',
        },
      });

      await transporter.sendMail({
        from: '"SmartCR" <no-reply@smartcr.com>',
        to: to.join(','),
        subject,
        text,
      });
    } catch (error) {
      console.error('Error sending emails:', error);
    }
  }
}