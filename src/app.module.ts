import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { SubmissionsModule } from './submissions/submissions.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'matola',      
      password: 'floki',       
      database: 'edubridge_db',
      autoLoadEntities: true,
      synchronize: true, 
    }),
    UsersModule,
    AuthModule,
    CoursesModule,
    AnnouncementsModule,
    AssignmentsModule,
    SubmissionsModule,
  ],
})
export class AppModule {}
