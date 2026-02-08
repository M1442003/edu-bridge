import { Controller, Post, Body, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/module.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post()
  create(@Body() createModuleDto: { name: string; courseId: number; semester: string; year: number }) {
    return this.modulesService.create(
      createModuleDto.name,
      createModuleDto.courseId,
      createModuleDto.semester as any,
      createModuleDto.year,
    );
  }

  @Post('bulk')
  createBulk(@Body() body: { modules: CreateModuleDto[] }) {
    return this.modulesService.createBulk(body.modules);
  }

  @Get()
  findAll() {
    return this.modulesService.findAll();
  }

  @Get('course/:courseId')
  findByCourse(@Param('courseId') courseId: string) {
    return this.modulesService.findByCourse(parseInt(courseId));
  }

  @Get('student')
  @UseGuards(AuthGuard('jwt'))
  async getStudentModules(@Request() req) {
    // This endpoint can be used if you don't have it in users service
    return [];
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.modulesService.findById(parseInt(id));
  }

  @Get(':id/stats')
  @UseGuards(AuthGuard('jwt'))
  getModuleStats(@Param('id') id: string) {
    return this.modulesService.getModuleStats(parseInt(id));
  }
}