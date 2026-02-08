import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '../users/user.entity';
import { Course } from '../courses/course.entity';
import { ClassEntity } from '../classes/class.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { BulkRegisterDto } from './dto/bulk-register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Course)
    private courseRepo: Repository<Course>,

    @InjectRepository(ClassEntity)
    private classRepo: Repository<ClassEntity>,

    private jwtService: JwtService,
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

  async registerBulk(dtos: BulkRegisterDto[]) {
    if (!Array.isArray(dtos) || dtos.length === 0) {
      throw new BadRequestException('Users array is required');
    }

    const results: { email: string; success: boolean; id?: number; reason?: string }[] = [];

    for (const dto of dtos) {
      try {
        const student = await this.register(dto);
        results.push({ email: dto.email, success: true, id: student.id });
      } catch (error: any) {
        results.push({ email: dto.email, success: false, reason: error.message });
      }
    }

    return { message: `${results.length} users processed`, results };
  }

  async registerLecturer(dto: Omit<RegisterDto, 'courseCode' | 'year'>) {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new BadRequestException('User already exists');
    }

    const lecturer = this.userRepo.create({
      name: dto.name,
      email: dto.email,
      regNo: dto.regNo,
      password: await bcrypt.hash(dto.password, 10),
      role: UserRole.LECTURER,
      class: null,
    });

    return this.userRepo.save(lecturer);
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
      relations: {
        class: {
          course: true,
          modules: true,
        },
        modules: true,
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      classId: user.class?.id,
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        regNo: user.regNo,
        createdAt: user.createdAt,
        courseCode: user.class?.course?.code ?? null,
        year: user.class?.year ?? null,
        class: user.class ? {
          id: user.class.id,
          name: `${user.class.course?.code}-${user.class.year}`,
          course: user.class.course,
        } : null,
        modules: user.modules,
      },
    };
  }
}