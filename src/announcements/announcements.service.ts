import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './announcements.entity';
import { ClassEntity } from '../classes/class.entity';
import { User } from '../users/user.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private announcementRepo: Repository<Announcement>,
    @InjectRepository(ClassEntity)
    private classRepo: Repository<ClassEntity>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private configService: ConfigService, // ConfigService for .env variables
  ) { }

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
        host: this.configService.get<string>('MAIL_HOST'),
        port: Number(this.configService.get<string>('MAIL_PORT') || 587),
        secure: false,
        auth: {
          user: this.configService.get<string>('MAIL_USER'),
          pass: this.configService.get<string>('MAIL_PASS'),
        },
      });
    

      await transporter.sendMail({
        from: this.configService.get<string>('MAIL_FROM'),
        to: to.join(','),
        subject,
        text,
      });
    } catch (error) {
      console.error('Error sending emails:', error);
    }
  }
}