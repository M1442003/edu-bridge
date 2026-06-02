import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Timetable } from './timetable.entity';
import * as nodemailer from 'nodemailer';
import { User } from '../users/user.entity';

@Injectable()
export class TimetableReminder {
  constructor(
    @InjectRepository(Timetable)
    private timetableRepo: Repository<Timetable>,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

  }
  private transporter: nodemailer.Transporter;

  @Cron('* * * * *')
  async remindLecturer() {
    const now = new Date();
    const day = now.getDay() === 0 ? 7 : now.getDay();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    const lessons = await this.timetableRepo.find({
      where: {
        dayOfWeek: day,
        reminderSent: false,
      },
    });

    for (const lesson of lessons) {
      const [h, m] = lesson.startTime.split(':').map(Number);
      const lessonMinutes = h * 60 + m;

      if (lessonMinutes - nowMinutes === 10) {
        await this.sendEmail(lesson);
        lesson.reminderSent = true;
        await this.timetableRepo.save(lesson);
      }
    }
  }

  @Cron('0 0 * * *')
  async resetReminders() {
    await this.timetableRepo.update({}, { reminderSent: false });
  }

  async sendEmail(lesson: Timetable) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    await transporter.sendMail({
      to: lesson.lecturer.email,
      subject: '⏰ Class Reminder',
      text: `
Hello ${lesson.lecturer.name},

You have a class starting in 10 minutes.

Class: ${lesson.class.name}
Venue: ${lesson.venue}
Time: ${lesson.startTime} - ${lesson.endTime}

EduBridge Reminder System
      `,
    });
  }
}
