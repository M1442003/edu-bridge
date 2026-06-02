import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async getProfile(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['class', 'class.course', 'class.modules', 'modules'],
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      regNo: user.regNo,
      role: user.role,
      courseCode: user.class?.course?.code || null,
      year: user.class?.year || null,
      class: user.class ? {
        id: user.class.id,
        name: `${user.class.course?.code}-${user.class.year}`,
        course: user.class.course,
        modules: user.class.modules,
      } : null,
      modules: user.modules,
      createdAt: user.createdAt,
    };
  }

  async updateProfile(userId: number, updateData: Partial<User>) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    delete updateData.password;
    delete updateData.role;
    delete updateData.id;

    Object.assign(user, updateData);
    return this.userRepo.save(user);
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Old password is incorrect');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepo.save(user);
    return { message: 'Password updated successfully' };
  }

  async getStudentModules(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['class', 'class.modules', 'class.modules.lecturers'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.class) {
      return [];
    }

return user.class.modules.map(module => ({
  id: module.id,
  code: module.code,
  name: module.name,
  description: module.description || module.name,
  semester: module.semester,
  year: module.year,
  lecturer: module.lecturers.length > 0 ? {
    name: module.lecturers[0].name,
    email: module.lecturers[0].email,
  } : { name: 'Dr. J', email: 'lecturer@edubridge.com' },
  newsCount: 0,
  tasksCount: 0,
    }));
  }
}