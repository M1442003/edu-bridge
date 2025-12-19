import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ClassesService } from './classes.service';

@Controller('classes')
export class ClassesController {
    constructor(private readonly classesService: ClassesService) { }

    @Post()
    create(
        @Body('name') name: string,
        @Body('year') year: number,
        @Body('courseId') courseId: number,
    ) {
        return this.classesService.create(name, year, courseId);
    }

    @Post(':id/students')
    addStudents(@Param('id') id: number, @Body('studentIds') studentIds: number[]) {
        return this.classesService.addStudents(id, studentIds);
    }

    @Post(':id/modules')
    assignModules(@Param('id') id: number, @Body('moduleIds') moduleIds: number[]) {
        return this.classesService.assignModules(id, moduleIds);
    }

    @Get()
    findAll() {
        return this.classesService.findAll();
    }

    @Get('course/:courseId')
    findByCourse(@Param('courseId') courseId: string) {
        return this.classesService.findByCourse(Number(courseId));
    }
}
