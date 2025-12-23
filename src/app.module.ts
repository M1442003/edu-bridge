import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Course } from './courses/course.entity';
import { Module as CourseModule } from './modules/module.entity';
import { ClassEntity } from './classes/class.entity';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { ModulesModule } from './modules/modules.module';
import { ClassesModule } from './classes/classes.module';
import { Announcement } from './announcements/announcements.entity';
import { Assignment } from './assignments/assignments.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'matola',
      password: 'floki',
      database: 'edubridge_db',
      entities: [User, Course, CourseModule, ClassEntity],
      synchronize: true,
    }),

    UsersModule,
    CoursesModule,
    ModulesModule,
    ClassesModule,
    ClassEntity,
    Course,
    User,
    CourseModule,
    Announcement,
    Assignment,
  ],
})
export class AppModule { }
