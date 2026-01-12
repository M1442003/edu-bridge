import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/user.entity';
import { Course } from '../courses/course.entity';
import { ClassEntity } from '../classes/class.entity';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Course)
    private courseRepo: Repository<Course>,

    @InjectRepository(ClassEntity)
    private classRepo: Repository<ClassEntity>,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new BadRequestException('User already exists');
    }

    const course = await this.courseRepo.findOne({ where: { code: dto.courseCode } });
    if (!course) throw new NotFoundException('Course not found');

    const cls = await this.classRepo.findOne({
      where: { course: { id: course.id }, year: dto.year },
      relations: ['modules'],
    });
    if (!cls) throw new NotFoundException('Class not found for this course/year');

    const student = this.userRepo.create({
      name: dto.name,
      regNo: dto.regNo,
      email: dto.email,
      password: await bcrypt.hash(dto.password, 10),
      role: UserRole.STUDENT,
      class: cls,
    });

    return this.userRepo.save(student);
  }

  async registerBulk(users: RegisterDto[]) {
    if (!Array.isArray(users) || users.length === 0) {
      throw new BadRequestException('Users array is required');
    }

    const results: { email: string; success: boolean; id?: number; reason?: string }[] = [];

    for (const dto of users) {
      try {
        const student = await this.register(dto);
        results.push({ email: dto.email, success: true, id: student.id });
      } catch (error: any) {
        results.push({ email: dto.email, success: false, reason: error.message });
      }
    }

    return { message: `${results.length} users processed`, results };
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new BadRequestException('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new BadRequestException('Invalid credentials');

    return user;
  }
}