import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { Assignment } from './assignments.entity';
import { ClassEntity } from '../classes/class.entity';
import { Module as CourseModule } from '../modules/module.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Assignment, CourseModule, ClassEntity])],
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
})
export class AssignmentsModule {}