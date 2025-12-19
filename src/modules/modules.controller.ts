import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/module.dto';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post()
  create(@Body() dto: CreateModuleDto) {
    return this.modulesService.create(dto.name, dto.courseId);
  }

  @Get()
  findAll() {
    return this.modulesService.findAll();
  }
   @Get('course/:courseId')
  findByCourse(@Param('courseId') courseId: string) {
    return this.modulesService.findByCourse(Number(courseId));
  }
}
