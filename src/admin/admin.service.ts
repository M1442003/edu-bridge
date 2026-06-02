import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/user.entity';
import { Course } from '../courses/course.entity';
import { ClassEntity } from '../classes/class.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { BulkRegisterDto } from '../auth/dto/bulk-register.dto';
import { Module as CourseModule } from '../modules/module.entity';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,

        @InjectRepository(Course)
        private courseRepo: Repository<Course>,

        @InjectRepository(ClassEntity)
        private classRepo: Repository<ClassEntity>,

        @InjectRepository(CourseModule)
        private moduleRepo: Repository<CourseModule>,
    ) { }

    // Create single student
    async createStudent(dto: CreateUserDto) {
        const existing = await this.userRepo.findOne({ where: { email: dto.email } });
        if (existing) throw new ConflictException('User already exists');

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

    async assignLecturerToModules(lecturerId: number, moduleIds: number[]) {
        const lecturer = await this.userRepo.findOne({
            where: { id: lecturerId },
            relations: ['modules'],
        });
        if (!lecturer) throw new NotFoundException('Lecturer not found');

        const modules = await this.moduleRepo.find({
            where: moduleIds.map(id => ({ id })),
        });

        lecturer.modules = [...(lecturer.modules || []), ...modules.filter(
            m => !lecturer.modules.some(lm => lm.id === m.id)
        )];

        return this.userRepo.save(lecturer);
    }

    // Create lecturer
    async createLecturer(dto: CreateUserDto) {
        const existing = await this.userRepo.findOne({ where: { email: dto.email } });
        if (existing) throw new ConflictException('User already exists');

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

    // Bulk create students
    async createBulkStudents(dtos: BulkRegisterDto[]) {
        if (!Array.isArray(dtos) || dtos.length === 0) {
            throw new BadRequestException('Users array is required');
        }

        const results: { email: string; success: boolean; id?: number; reason?: string }[] = [];

        for (const dto of dtos) {
            try {
                const existing = await this.userRepo.findOne({ where: { email: dto.email } });
                if (existing) {
                    results.push({ email: dto.email, success: false, reason: 'User already exists' });
                    continue;
                }

                const course = dto.courseCode
                    ? await this.courseRepo.findOne({ where: { code: dto.courseCode } })
                    : null;
                if (dto.courseCode && !course) {
                    results.push({ email: dto.email, success: false, reason: 'Course not found' });
                    continue;
                }

                const cls = dto.courseCode && dto.year && course  // 👈 add && course
                    ? await this.classRepo.findOne({
                        where: { course: { id: course.id }, year: dto.year },
                        relations: ['modules'],
                    })
                    : null;
                null;
                if (dto.courseCode && dto.year && !cls) {
                    results.push({ email: dto.email, success: false, reason: 'Class not found' });
                    continue;
                }

                const user = this.userRepo.create({
                    name: dto.name,
                    regNo: dto.regNo,
                    email: dto.email,
                    password: await bcrypt.hash(dto.password, 10),
                    role: UserRole.STUDENT,
                    class: cls,
                });

                const saved = await this.userRepo.save(user);
                results.push({ email: dto.email, success: true, id: saved.id });
            } catch (error: any) {
                results.push({ email: dto.email, success: false, reason: error.message });
            }
        }

        return { message: `${results.length} users processed`, results };
    }

    // Get all users
    async getAllUsers() {
        return this.userRepo.find({
            select: ['id', 'name', 'email', 'role', 'isActive', 'createdAt', 'regNo'],
        });
    }

    // Deactivate user
    async deactivateUser(id: string) {
        const user = await this.userRepo.findOne({ where: { id: parseInt(id) } });
        if (!user) throw new NotFoundException('User not found');
        user.isActive = false;
        return this.userRepo.save(user);
    }

    // Assign student to class
    async assignStudentToClass(studentId: number, classId: number) {
        const student = await this.userRepo.findOne({ where: { id: studentId } });
        if (!student) throw new NotFoundException('Student not found');

        const cls = await this.classRepo.findOne({ where: { id: classId } });
        if (!cls) throw new NotFoundException('Class not found');

        student.class = cls;
        return this.userRepo.save(student);
    }
}