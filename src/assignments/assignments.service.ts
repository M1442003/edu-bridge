import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './assignments.entity';
import { ClassEntity } from '../classes/class.entity';
import * as nodemailer from 'nodemailer';
import { Module } from '../modules/module.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepo: Repository<Assignment>,

    @InjectRepository(Module)
    private moduleRepo: Repository<Module>,

    @InjectRepository(ClassEntity)
    private classRepo: Repository<ClassEntity>,
  ) { }

  async create(
    dto: CreateAssignmentDto,
    files: Express.Multer.File[],
  ) {
    const cls = await this.classRepo.findOne({
      where: { id: dto.classId },
      relations: ['students', 'modules'],
    });
    if (!cls) throw new NotFoundException('Class not found');

    const module = await this.moduleRepo.findOne({
      where: { id: dto.moduleId },
    });
    if (!module) throw new NotFoundException('Module not found');

    const classHasModule = cls.modules.some((m) => m.id === module.id);
    if (!classHasModule) {
      throw new NotFoundException('Module not assigned to this class');
    }

    const attachments = files?.map((file) => ({
      originalName: file.originalname,
      fileName: file.filename,
      mimeType: file.mimetype,
      size: file.size,
    }));

    const assignment = this.assignmentRepo.create({
      title: dto.title,
      description: dto.description,
      dueDate: dto.dueDate,
      class: cls,
      module,
      attachments,
    });

    await this.assignmentRepo.save(assignment);

    if (cls.students.length) {
      await this.sendEmail(
        cls.students.map((s) => s.email),
        assignment,
      );
    }

    return assignment;
  }

  async findByClass(classId: number) {
    return this.assignmentRepo.find({
      where: { class: { id: classId } },
      relations: ['module'],
      order: { createdAt: 'DESC' },
    });
  }

  async findForStudent(studentClassId: number) {
    return this.assignmentRepo.find({
      where: { class: { id: studentClassId } },
      relations: ['module'],
      order: { dueDate: 'ASC' },
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

    const fileLinks =
      assignment.attachments?.map(
        (f) =>
          `📎 ${f.originalName}: ${process.env.APP_URL}/files/assignments/${f.fileName}`,
      ).join('\n') || 'No attachments';

    await transporter.sendMail({
      from: `"EduBridge" <${process.env.MAIL_USER}>`,
      to: to.join(','),
      subject: `New Assignment: ${assignment.title}`,
      text: `
New assignment posted

Module: ${assignment.module.name}
Title: ${assignment.title}
Due: ${assignment.dueDate.toDateString()}

${fileLinks}
      `,
    });
  }
}