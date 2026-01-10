import { Module as NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import { AuthModule } from './auth/auth.module';

@NestModule({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 5432),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
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
    AssignmentsModule,
    AuthModule,
  ],
})
export class AppModule { }
