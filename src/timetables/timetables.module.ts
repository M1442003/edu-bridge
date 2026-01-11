import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Timetable } from './timetable.entity';
import { TimetablesService } from './timetables.service';
import { TimetablesController } from './timetables.controller';
import { User } from '../users/user.entity';
import { ClassEntity } from '../classes/class.entity';
import { TimetableReminder } from './timetable.reminder';

@Module({
  imports: [
    TypeOrmModule.forFeature([Timetable, User, ClassEntity]),
  ],
  controllers: [TimetablesController],
  providers: [TimetablesService, TimetableReminder],
})
export class TimetablesModule { }
