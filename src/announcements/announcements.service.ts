import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './announcements.entity';
import { ClassEntity } from '../classes/class.entity';
import { User } from '../users/user.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private announcementRepo: Repository<Announcement>,

    @InjectRepository(ClassEntity)
    private classRepo: Repository<ClassEntity>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    private configService: ConfigService,
  ) {}

  async create(
    dto: CreateAnnouncementDto,
    lecturer: User,
  ): Promise<Announcement> {
    if (!lecturer || lecturer.role !== 'LECTURER') {
      throw new ForbiddenException('Only lecturers can post announcements');
    }

    const lecturerEntity = await this.userRepo.findOne({
      where: { id: lecturer.id },
      relations: ['modules'],
    });

    if (!lecturerEntity) {
      throw new NotFoundException('Lecturer not found');
    }

    const teachesModule = lecturerEntity.modules.some(
      (m) => m.id === dto.moduleId,
    );

    if (!teachesModule) {
      throw new ForbiddenException('You do not teach this module');
    }

    const classEntity = await this.classRepo.findOne({
      where: { id: dto.classId },
      relations: ['students', 'modules'],
    });

    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }

    const module = classEntity.modules.find(
      (m) => m.id === dto.moduleId,
    );

    if (!module) {
      throw new ForbiddenException('Module not assigned to this class');
    }

    const announcement = this.announcementRepo.create({
      title: dto.title,
      content: dto.content,
      class: classEntity,
      module: module,
    });

    await this.announcementRepo.save(announcement);

    // Send email notifications to students
    const emails = classEntity.students
      .map((s) => s.email)
      .filter((e) => e && !e.endsWith('@example.com'));

    if (emails.length) {
      await this.sendEmail(emails, dto.title, dto.content);
    }

    return announcement;
  }

  async findByClass(classId: number): Promise<Announcement[]> {
    return this.announcementRepo.find({
      where: { class: { id: classId } },
      relations: ['module', 'class'],
      order: { createdAt: 'DESC' },
    });
  }

  async findForStudent(classId: number): Promise<Announcement[]> {
    return this.announcementRepo.find({
      where: { class: { id: classId } },
      relations: ['module', 'class'],
      order: { createdAt: 'DESC' },
    });
  }

  async getRecentAnnouncements(classId: number, limit: number = 5): Promise<Announcement[]> {
    return this.announcementRepo.find({
      where: { class: { id: classId } },
      relations: ['module', 'class'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findById(id: number): Promise<Announcement> {
    const announcement = await this.announcementRepo.findOne({
      where: { id },
      relations: ['module', 'class'],
    });
    
    if (!announcement) {
      throw new NotFoundException('Announcement not found');
    }
    
    return announcement;
  }

  async getDashboardAnnouncements(classId: number): Promise<Announcement[]> {
    return this.announcementRepo.find({
      where: { class: { id: classId } },
      relations: ['module', 'class'],
      order: { createdAt: 'DESC' },
      take: 10,
    });
  }

  async findAll(): Promise<Announcement[]> {
    return this.announcementRepo.find({
      relations: ['module', 'class'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, dto: Partial<CreateAnnouncementDto>): Promise<Announcement> {
    const announcement = await this.findById(id);
    
    Object.assign(announcement, dto);
    return this.announcementRepo.save(announcement);
  }

  async delete(id: number): Promise<void> {
    const result = await this.announcementRepo.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException('Announcement not found');
    }
  }

  private async sendEmail(
    to: string[],
    subject: string,
    text: string,
  ): Promise<void> {
    const retries = 3;
    
    for (let i = 1; i <= retries; i++) {
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
          subject: `[EduBridge] ${subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.5; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">EduBridge</h1>
                <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0 0;">Student Portal</p>
              </div>
              <div style="padding: 30px; background: #f9f9f9;">
                <h2 style="color: #333; margin-top: 0;">${subject}</h2>
                <div style="background: white; padding: 20px; border-radius: 5px; border-left: 4px solid #667eea;">
                  <p style="color: #555; line-height: 1.6;">${text}</p>
                </div>
                <p style="color: #777; font-size: 14px; margin-top: 25px;">
                  This is an automated notification from EduBridge. Please do not reply to this email.
                </p>
              </div>
              <div style="background: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #888;">
                <p>© ${new Date().getFullYear()} EduBridge. All rights reserved.</p>
                <p>If you wish to unsubscribe from these notifications, please update your preferences in your account settings.</p>
              </div>
            </div>
          `,
        });

        console.log(`Email sent successfully to ${to.length} students on attempt ${i}`);
        break;
      } catch (error) {
        console.error(`Attempt ${i} failed to send email:`, error);
        if (i === retries) {
          console.error('All email retries failed. Continuing without email notification.');
        }
        await new Promise((res) => setTimeout(res, 2000));
      }
    }
  }
}