import { Controller, Post, Body, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/module.dto';
import { Public } from '../auth/public.decorator';

@Public()
@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post()
  create(@Body() dto: CreateModuleDto) {
    return this.modulesService.create(
      dto.name,
      dto.courseId,
      dto.semester,
      dto.year,
      dto.code,  
    );
  }

  @Post('bulk')
  createBulk(@Body() body: { modules: CreateModuleDto[] }) {
    return this.modulesService.createBulk(body.modules);
  }

  @Public()  
  @Get()
  findAll() {
    return this.modulesService.findAll();
  }

  @Get('course/:courseId')
  findByCourse(@Param('courseId') courseId: string) {
    return this.modulesService.findByCourse(parseInt(courseId));
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.modulesService.findById(parseInt(id));
  }

  @Get(':id/stats')
  getModuleStats(@Param('id') id: string) {
    return this.modulesService.getModuleStats(parseInt(id));
  }
}