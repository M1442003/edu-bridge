import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { ClassEntity } from './class.entity';
import { Course } from '../courses/course.entity';
import { User } from '../users/user.entity';
import { Module as CourseModule } from '../modules/module.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClassEntity, Course, User, CourseModule]),
  ],
  providers: [ClassesService],
  controllers: [ClassesController],
})
export class ClassesModule {}
