import { Module as NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Course } from './courses/course.entity';
import { Module } from './modules/module.entity';
import { ClassEntity } from './classes/class.entity';
import { Announcement } from './announcements/announcements.entity';
import { Assignment } from './assignments/assignments.entity';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { ModulesModule } from './modules/modules.module';
import { ClassesModule } from './classes/classes.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { AssignmentsModule } from './assignments/assignments.module';

@NestModule({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'matola',
      password: 'floki',
      database: 'edubridge_db',
      entities: [
        User,
        Course,
        Module,
        ClassEntity,
        Announcement,
        Assignment,
      ],
      synchronize: true,
    }),

    UsersModule,
    CoursesModule,
    ModulesModule,
    ClassesModule,
    AnnouncementsModule,
    AnnouncementsModule,
    AssignmentsModule,
  ],
})
export class AppModule {}
