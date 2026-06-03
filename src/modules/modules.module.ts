import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { Module as ModuleEntity } from './module.entity';
import { Course } from '../courses/course.entity';
import { ClassEntity } from '../classes/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ModuleEntity, Course, ClassEntity])],
  controllers: [ModulesController],
  providers: [ModulesService],
})
export class ModulesModule {}
