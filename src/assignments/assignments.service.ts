import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './assignments.entity';
import { ClassEntity } from '../classes/class.entity';
import * as nodemailer from 'nodemailer';
import { Module } from '../modules/module.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepo: Repository<Assignment>,

    @InjectRepository(Module)
    private moduleRepo: Repository<Module>,

    @InjectRepository(ClassEntity)
    private classRepo: Repository<ClassEntity>,

    private configService: ConfigService, // REMOVE UserRepository if not needed
  ) {}

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
      dueDate: new Date(dto.dueDate),
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

  async findForStudent(classId: number) {
    return this.assignmentRepo.find({
      where: { class: { id: classId } },
      relations: ['module'],
      order: { dueDate: 'ASC' },
    });
  }

  async findById(id: number) {
    const assignment = await this.assignmentRepo.findOne({
      where: { id },
      relations: ['module', 'class', 'class.students'],
    });
    if (!assignment) throw new NotFoundException('Assignment not found');
    return assignment;
  }

  async getUpcomingAssignments(classId: number, limit: number = 5) {
    const now = new Date();
    return this.assignmentRepo.find({
      where: { 
        class: { id: classId },
        dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
      },
      relations: ['module'],
      order: { dueDate: 'ASC' },
      take: limit,
    });
  }

  async findAll() {
    return this.assignmentRepo.find({
      relations: ['module', 'class'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, dto: Partial<CreateAssignmentDto>) {
    const assignment = await this.findById(id);
    Object.assign(assignment, dto);
    if (dto.dueDate) assignment.dueDate = new Date(dto.dueDate);
    return this.assignmentRepo.save(assignment);
  }

  async delete(id: number) {
    const result = await this.assignmentRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Assignment not found');
  }

  private async sendEmail(to: string[], assignment: Assignment) {
    try {
      const transporter = nodemailer.createTransport({
        host: this.configService.get<string>('MAIL_HOST'),
        port: Number(this.configService.get<string>('MAIL_PORT')),
        secure: false,
        auth: {
          user: this.configService.get<string>('MAIL_USER'),
          pass: this.configService.get<string>('MAIL_PASS'),
        },
      });

      const dueDate = new Date(assignment.dueDate);

      const fileLinks =
        assignment.attachments?.map(
          (f) =>
            `📎 ${f.originalName}: ${this.configService.get<string>('APP_URL')}/files/assignments/${f.fileName}`,
        ).join('\n') || 'No attachments';

      await transporter.sendMail({
        from: `"EduBridge" <${this.configService.get<string>('MAIL_FROM')}>`,
        to: to.join(','),
        subject: `New Assignment: ${assignment.title}`,
        text: `
New assignment posted

Module: ${assignment.module.name}
Title: ${assignment.title}
Due: ${dueDate.toDateString()}

${fileLinks}
        `,
      });
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }
}