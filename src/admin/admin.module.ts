import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../users/user.entity';
import { Course } from '../courses/course.entity';
import { ClassEntity } from '../classes/class.entity';
import { Module as CourseModule } from '../modules/module.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Course, ClassEntity, CourseModule])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}