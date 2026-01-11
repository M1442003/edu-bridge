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
  ) { }

  async create(
    classId: number,
    title: string,
    description: string,
    dueDate: Date,
    files: Express.Multer.File[],
  ) {
    const cls = await this.classRepo.findOne({
      where: { id: classId },
      relations: ['students'],
    });

    if (!cls) throw new NotFoundException('Class not found');

    const attachments = files?.map((file) => ({
      originalName: file.originalname,
      fileName: file.filename,
      mimeType: file.mimetype,
      size: file.size,
    }));

    const assignment = this.assignmentRepo.create({
      title,
      description,
      dueDate,
      class: cls,
      attachments,
    });

    await this.assignmentRepo.save(assignment);

    const emails = cls.students.map((s) => s.email);
    if (emails.length) {
      await this.sendEmail(emails, assignment);
    }

    return assignment;
  }


  async findByClass(classId: number) {
    return this.assignmentRepo.find({
      where: { class: { id: classId } },
      order: { createdAt: 'DESC' },
    });
  }

  private async sendEmail(to: string[], assignment: Assignment) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const fileLinks = assignment.attachments?.map(
      (file) =>
        `📎 ${file.originalName}: http://localhost:3000/files/assignments/${file.fileName}`,
    ).join('\n');

    await transporter.sendMail({
      from: `"EduBridge" <${process.env.MAIL_USER}>`,
      to: to.join(','),
      subject: `New Assignment: ${assignment.title}`,
      text: `
New assignment has been posted.

Title: ${assignment.title}
Description: ${assignment.description}
Due Date: ${assignment.dueDate.toDateString()}

Attachments:
${fileLinks || 'No attachments'}

Login to EduBridge for more details.
    `,
    });
  }

}