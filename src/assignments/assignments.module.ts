import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentsController } from './assignments.controller';
import AssignmentsService from './assignments.service';
import { Assignment } from './assignments.entity';
import { ClassEntity } from '../classes/class.entity';
import { Module as CourseModule } from '../modules/module.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Assignment,
      ClassEntity,
      CourseModule,
    ]),
  ],
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}