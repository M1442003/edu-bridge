import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './assignments.entity';
import { ClassEntity } from '../classes/class.entity';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepo: Repository<Assignment>,
    @InjectRepository(ClassEntity)
    private classRepo: Repository<ClassEntity>,
  ) {}

  async create(
    classId: number,
    title: string,
    description: string,
    dueDate: Date,
  ): Promise<Assignment> {
    const classEntity = await this.classRepo.findOne({
      where: { id: classId },
      relations: ['students'],
    });

    if (!classEntity) throw new NotFoundException('Class not found');

    const assignment = this.assignmentRepo.create({
      title,
      description,
      dueDate,
      class: classEntity,
    });

    await this.assignmentRepo.save(assignment);

    const emails = classEntity.students.map((s) => s.email);
    if (emails.length) {
      await this.sendEmail(
        emails,
        `New Assignment: ${title}`,
        `Description: ${description}\nDue Date: ${dueDate.toDateString()}`,
      );
    }

    return assignment;
  }

  async findByClass(classId: number): Promise<Assignment[]> {
    return this.assignmentRepo.find({
      where: { class: { id: classId } },
      order: { createdAt: 'DESC' },
    });
  }

  private async sendEmail(to: string[], subject: string, text: string) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'yourgmail@gmail.com',
          pass: 'APP_PASSWORD',
        },
      });

      await transporter.sendMail({
        from: '"SmartCR" <no-reply@smartcr.com>',
        to: to.join(','),
        subject,
        text,
      });
    } catch (error) {
      console.error('Assignment email error:', error);
    }
  }
}