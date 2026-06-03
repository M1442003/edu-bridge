import { Controller, Post, Body, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/module.dto';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassEntity } from '../classes/class.entity';
import { Public } from '../auth/public.decorator';

@Controller('modules')
export class ModulesController {
  constructor(
    private readonly modulesService: ModulesService,
    @InjectRepository(ClassEntity)
    private classRepo: Repository<ClassEntity>,
  ) {}

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

  @Get('student')
  @UseGuards(AuthGuard('jwt'))
  async getStudentModules(@Request() req) {
    const classId = req.user?.classId;
    if (!classId) return [];

    const cls = await this.classRepo.findOne({
      where: { id: classId },
      relations: ['modules', 'modules.course'],
    });
    return cls?.modules || [];
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